from confluent_kafka import Consumer, KafkaError, KafkaException
from modules.data_injection.chromadb import loadFileToChromadb, loadToChromadb
import json
import sys
import asyncio
from config.kafka_consumer_config import kafkaConsumerConfig
import utils.constants.app_constants as APP_CONSTANTS
from fastapi import FastAPI
from modules.enrichment import EnrichmentRequestService


app = FastAPI()
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
                    await loadFileToChromadb(message_value)
                    await enrichmentService.updateEnrichmentDetails(message_value)

    finally:
        # Close down consumer cleanly
        consumer.close()

if __name__ == '__main__':
    topics = [APP_CONSTANTS.KAFKA_TOPIC_ENRICHMENT]  # List of topics to subscribe to
    consumer = kafkaConsumerConfig.kafka_consumer()

    # Run asynchronous consume loop
    asyncio.run(basic_consume_loop(consumer, topics))