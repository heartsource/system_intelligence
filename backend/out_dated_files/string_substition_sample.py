import sys
sys.path.append("../app")
from config_Loader import get_configs
config = get_configs()


template = config.get("TEMPLATE_AI")
print(f"Template: {template}")
formated_template = template.format("Substitute my context", "This is my Qustion")
print(f"formated_template: {formated_template}")