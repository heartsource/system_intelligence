from confluent_kafka import Producer
import utils.constants.error_messages as ERROR_MESSAGES
from fastapi import HTTPException
import os

class KafkaProducerConfig:
    def __init__(self) -> None:
        try:
            self.kafka_host = os.getenv('KAFKA_HOST')
            self.kafka_port = int(os.getenv('KAFKA_PORT'))
            self.kafka_acks = os.getenv('KAFKA_ACKS')
            self.kafka_retries = int(os.getenv('KAFKA_RETRIES'))
            self.kafka_linger = int(os.getenv('KAFKA_LINGER'))
        except Exception as e:
            print(f"Error initializing KafkaProducerConfig: {e}")
            raise HTTPException(status_code=500, detail=ERROR_MESSAGES.KAFKA_CONN_ERROR)

    def kafka_producer(self):
        try: 
            # Kafka producer configuration
            producer_conf = {
                'bootstrap.servers': f'{self.kafka_host}:{self.kafka_port}',  # Kafka broker
                'acks': self.kafka_acks,  # Ensure message replication to all in-sync replicas
                'retries': self.kafka_retries,   # Optional: Retry sending message in case of failure
                'linger.ms': self.kafka_linger  # Optional: Add a small delay to batch messages
                # 'sasl.mechanisms': 'PLAIN',  # Uncomment if using Confluent Cloud
                # 'security.protocol': 'SASL_SSL',  # Uncomment if using Confluent Cloud
                # 'sasl.username': 'your_confluent_cloud_key',  # Uncomment for SASL Auth
                # 'sasl.password': 'your_confluent_cloud_secret',  # Uncomment for SASL Auth
            }
            producer = Producer(producer_conf)
            return producer
        except Exception as e:
            raise Exception(e)

kafkaProducerConfig = KafkaProducerConfig()
