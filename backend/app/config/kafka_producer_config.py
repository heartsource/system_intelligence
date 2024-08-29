from confluent_kafka import Producer
import utils.constants.error_constants as ERROR_CONSTANTS
from fastapi import HTTPException
import os

class KafkaProducerConfig:
    def __init__(self) -> None:
        try:
            self.kafka_host = os.getenv('KAFKA_HOST')
            self.kafka_port = int(os.getenv('KAFKA_PORT'))
        except Exception as e:
            print(f"Error connecting to Kafka: {e}")
            raise HTTPException(status_code=500, detail=ERROR_CONSTANTS.KAFKA_CONN_ERROR)

    def kafka_producer(self):
        try: 
            # Kafka producer configuration
            producer_conf = {
                'bootstrap.servers': f'{self.kafka_host}:{self.kafka_port}',  # e.g., 'localhost:9092' or Confluent Cloud broker
                # 'sasl.mechanisms': 'PLAIN',  # if using Confluent Cloud
                # 'security.protocol': 'SASL_SSL',  # if using Confluent Cloud
                # 'sasl.username': 'your_confluent_cloud_key',
                # 'sasl.password': 'your_confluent_cloud_secret',
            }
            producer = Producer(producer_conf)
            return producer
        except Exception as e:
            raise Exception(e)

kafkaProducerConfig = KafkaProducerConfig()
