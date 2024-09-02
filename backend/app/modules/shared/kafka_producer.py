from config.kafka_producer_config import kafkaProducerConfig
import json

producer = kafkaProducerConfig.kafka_producer()

def delivery_report(err, msg):
    if err is not None:
        print(f"Message delivery failed: {err}")
    else:
        print(f"Message delivered to {msg.topic()} [{msg.partition()}]")

async def produce_message(topic: str, data: dict):
    try:
        # Serialize the dictionary to a JSON string and encode it as bytes
        serialized_data = json.dumps(data).encode('utf-8')
        
        # Produce the message
        producer.produce(topic, serialized_data, callback=delivery_report)
        
        # Wait for any outstanding messages to be delivered
        producer.flush()

        return {"status": "Message produced"}
    
    except Exception as e:
        print(f"Failed to produce message: {e}")
        return {"status": "Failed to produce message", "error": str(e)}
