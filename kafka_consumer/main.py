from confluent_kafka import Consumer, KafkaError, KafkaException
from confluent_kafka.admin import AdminClient, NewTopic
from modules.data_injection.chromadb import loadFileToChromadb, loadToChromadb
import json
import sys
import asyncio
from config.kafka_consumer_config import kafkaConsumerConfig
import utils.constants.app_constants as APP_CONSTANTS
from modules.enrichment import EnrichmentRequestService
import signal

enrichmentService = EnrichmentRequestService()

def decode_message(value):
    try:
        return value.decode('utf-8')
    except UnicodeDecodeError as e:
        print(f"Failed to decode message using UTF-8: {e}")
        return None

def is_json(message_value):
    message_value = message_value.strip()
    return message_value.startswith('{') or message_value.startswith('[')

async def basic_consume_loop(consumer, topics):
    try:
        consumer.subscribe(topics)
        print(f"Subscribed to topics: {topics}")
        while True:
            msg = consumer.poll(timeout=1.0)
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    sys.stderr.write('%% %s [%d] reached end at offset %d\n' % (msg.topic(), msg.partition(), msg.offset()))
                elif msg.error():
                    raise KafkaException(msg.error())
            else:
                raw_message_value = msg.value()
                print("Received message")
                message_value = decode_message(raw_message_value)
                if message_value:
                    print(f"Decoded message: {message_value}")
                    if is_json(message_value):
                        try:
                            message_data = json.loads(message_value)
                            await loadToChromadb(message_data['message'])
                            await enrichmentService.updateEnrichmentDetails(message_data['enrichment_id'])
                        except json.JSONDecodeError as e:
                            print(f'Failed to decode JSON from message: {message_value} - Error: {e}')
                    else:
                        await loadToChromadb(message_value)
                        await enrichmentService.updateEnrichmentDetails(message_value)
                else:
                    print(f"Could not decode message: {raw_message_value}")
                    await loadFileToChromadb(message_value)
    finally:
        consumer.close()

def create_kafka_topic(bootstrap_servers, topic_name, num_partitions=APP_CONSTANTS.NUM_PARTITIONS, replication_factor=APP_CONSTANTS.REPLICATION_FACTOR):
    try:
        admin_client = AdminClient({'bootstrap.servers': bootstrap_servers})
        topic_list = [NewTopic(topic=topic_name, num_partitions=num_partitions, replication_factor=replication_factor)]
        futures = admin_client.create_topics(topic_list)
        for topic, future in futures.items():
            try:
                future.result()
                print(f"Topic '{topic_name}' created successfully.")
            except Exception as e:
                if 'already exists' in str(e):
                    print(f"Topic '{topic_name}' already exists.")
                else:
                    print(f"Failed to create topic '{topic_name}': {e}")
    except Exception as e:
        print(f"Error during topic creation: {e}")

def shutdown(consumer):
    print("Shutting down Kafka consumer")
    consumer.close()

if __name__ == '__main__':
    print("In kafka consumer main")
    topics = [APP_CONSTANTS.KAFKA_TOPIC_NAME]
    bootstrap_servers = f'{kafkaConsumerConfig.kafka_host}:{kafkaConsumerConfig.kafka_port}'
    print(bootstrap_servers)
    topic_name = APP_CONSTANTS.KAFKA_TOPIC_NAME
    create_kafka_topic(bootstrap_servers, topic_name)
    consumer = kafkaConsumerConfig.kafka_consumer()

    # Add shutdown signal handling
    signal.signal(signal.SIGINT, lambda sig, frame: shutdown(consumer))
    signal.signal(signal.SIGTERM, lambda sig, frame: shutdown(consumer))

    try:
        asyncio.run(basic_consume_loop(consumer, topics))
    except Exception as e:
        print(f"Error in consume loop: {e}")
    finally:
        shutdown(consumer)
