from config.kafka_producer_config import kafkaProducerConfig

producer = kafkaProducerConfig.kafka_producer()

def delivery_report(err, msg):
    if err is not None:
        print(f"Message delivery failed: {err}")
    else:
        print(f"Message delivered to {msg.topic()} [{msg.partition()}]")

async def produce_message(topic: str, message: str):
    producer.produce(topic, message.encode('utf-8'), callback= delivery_report)
    producer.flush()
    return {"status": "Message produced"}
