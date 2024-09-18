from confluent_kafka import Consumer, KafkaError, KafkaException
from confluent_kafka.admin import AdminClient, NewTopic
from modules.data_injection.chromadb import loadFileToChromadb, loadToChromadb
import json
import sys
import asyncio
from config.kafka_consumer_config import kafkaConsumerConfig
import utils.constants.app_constants as APP_CONSTANTS
from modules.enrichment import EnrichmentRequestService


enrichmentService = EnrichmentRequestService()

def decode_message(value):
    """Attempt to decode the message with UTF-8 and handle errors."""
    try:
        return value.decode('utf-8')
    except UnicodeDecodeError as e:
        print(f"Failed to decode message using UTF-8: {e}")
        # Return the raw bytes or try another decoding method if necessary
        return None

def is_json(message_value):
    """Check if the message looks like JSON."""
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
                    sys.stderr.write('%% %s [%d] reached end at offset %d\n' %
                                     (msg.topic(), msg.partition(), msg.offset()))
                elif msg.error():
                    raise KafkaException(msg.error())
            else:
                # Process the message
                raw_message_value = msg.value()
                print("Received message")
                message_value = decode_message(raw_message_value)

                if message_value:
                    # Determine if the message is JSON
                    if is_json(message_value):
                        # Attempt to parse the JSON message
                        try:
                            message_data = json.loads(message_value)
                            # Process the message data
                            await loadToChromadb(message_data['message'])
                            await enrichmentService.updateEnrichmentDetails(message_data['enrichment_id'])
                        except json.JSONDecodeError as e:
                            print(f'Failed to decode JSON from message: {message_value} - Error: {e}')
                    else:
                        # Handle non-JSON messages here
                        await loadToChromadb(message_value)
                        await enrichmentService.updateEnrichmentDetails(message_value)
                else:
                    print(f"Could not decode message: {raw_message_value}")
                    await loadFileToChromadb(message_value)
                    await enrichmentService.updateEnrichmentDetails(message_value)

    finally:
        # Close down consumer cleanly
        consumer.close()


def create_kafka_topic(bootstrap_servers, topic_name, num_partitions=APP_CONSTANTS.NUM_PARTITIONS, replication_factor=APP_CONSTANTS.REPLICATION_FACTOR):
    """Create a Kafka topic if it doesn't already exist."""
    try:
        admin_client = AdminClient({'bootstrap.servers': bootstrap_servers})
        topic_list = [NewTopic(topic=topic_name, num_partitions=num_partitions, replication_factor=replication_factor)]
        
        # Create topics and handle exceptions
        futures = admin_client.create_topics(topic_list)
        for topic, future in futures.items():
            try:
                future.result()  # Wait for result
                print(f"Topic '{topic_name}' created successfully.")
            except Exception as e:
                if 'already exists' in str(e):
                    print(f"Topic '{topic_name}' already exists.")
                else:
                    print(f"Failed to create topic '{topic_name}': {e}")
    except Exception as e:
        print(f"Error during topic creation: {e}")


if __name__ == '__main__':
    topics = [APP_CONSTANTS.KAFKA_TOPIC_NAME]  # List of topics to subscribe to

    # Kafka configuration
    bootstrap_servers = f'{kafkaConsumerConfig.kafka_host}:{kafkaConsumerConfig.kafka_port}'  # Replace with your Kafka broker address
    print(bootstrap_servers)
    topic_name = APP_CONSTANTS.KAFKA_TOPIC_NAME

    # Create Kafka topic before starting the consumer
    create_kafka_topic(bootstrap_servers, topic_name)

    # Configure and create Kafka consumer
    consumer = kafkaConsumerConfig.kafka_consumer()

    # Run asynchronous consume loop
    asyncio.run(basic_consume_loop(consumer, topics))
