from confluent_kafka import Consumer
import utils.constants.message_constants as MESSAGE_CONSTANTS
from fastapi import HTTPException
import os

class KafkaConsumerConfig:
    def __init__(self) -> None:
        try:
            self.kafka_host = os.getenv('KAFKA_HOST')
            self.kafka_port = int(os.getenv('KAFKA_PORT'))
            self.group_id = os.getenv('GROUP_ID')
            self.auto_offset_rest = os.getenv('AUTO_OFFSET_RESET')
            self.session_timeout = int(os.getenv('SESSION_TIMEOUT'))
            self.max_poll_interval = int(os.getenv('MAX_POLL_INTERVAL'))
            self.message_max_bytes = int(os.getenv('MESSAGE_MAX_BYTES'))
        except Exception as e:
            print(f"Error connecting to Kafka: {e}")
            raise HTTPException(status_code=500, detail=MESSAGE_CONSTANTS.KAFKA_CONN_ERROR)

    def kafka_consumer(self):
        try: 
            # Kafka consumer configuration
            consumer_conf = {
                'bootstrap.servers': f'{self.kafka_host}:{self.kafka_port}',  # e.g., 'localhost:9092' or Confluent Cloud broker
                'group.id': self.group_id,
                'auto.offset.reset': self.auto_offset_rest,
                'session.timeout.ms': self.session_timeout,   # Adjust session timeout as needed
                'max.poll.interval.ms': self.max_poll_interval,  # Adjust poll interval as needed
                'message.max.bytes': self.message_max_bytes
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