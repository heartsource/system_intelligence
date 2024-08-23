from confluent_kafka import Consumer
import utils.constants.error_constants as ERROR_CONSTANTS
from fastapi import HTTPException
import os

class KafkaConsumerConfig:
    def __init__(self) -> None:
        try:
            self.kafka_host = os.getenv('KAFKA_HOST')
            self.kafka_port = int(os.getenv('KAFKA_PORT'))
        except Exception as e:
            print(f"Error connecting to Kafka: {e}")
            raise HTTPException(status_code=500, detail=ERROR_CONSTANTS.KAFKA_CONN_ERROR)

    def kafka_consumer(self):
        try: 
            # Kafka consumer configuration
            consumer_conf = {
                'bootstrap.servers': f'{self.kafka_host}:{self.kafka_port}',  # e.g., 'localhost:9092' or Confluent Cloud broker
                'group.id': 'test-group',
                'auto.offset.reset': 'earliest'
            }
            consumer = Consumer(consumer_conf)
            return consumer
        except Exception as e:
            raise Exception(e)

kafkaConsumerConfig = KafkaConsumerConfig()


# from kafka.errors import NoBrokersAvailable

# for _ in range(5):  # Retry 5 times
#     try:
#         consumer = KafkaConsumer(
#             'test',
#             bootstrap_servers=['localhost:9092'],
#             auto_offset_reset='earliest',
#             enable_auto_commit=True,
#             group_id='my-group',
#             value_deserializer=lambda m: json.loads(m.decode('utf-8'))
#             )
#         break
#     except NoBrokersAvailable:
#         time.sleep(5)  # Wait 5 seconds before retrying
# else:
#     raise Exception("Could not connect to Kafka broker after several attempts")