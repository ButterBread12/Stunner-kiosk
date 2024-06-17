from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
import re
import threading
import time

app = Flask(__name__)
CORS(app)

recognizer = sr.Recognizer()
microphone = sr.Microphone()

cache = {}

def recognize_speech_from_mic():
    with microphone as source:
        print("Listening...")
        recognizer.adjust_for_ambient_noise(source, duration=0.5)  # 주변 소음 인식 조정 시간 최적화
        audio = recognizer.listen(source)
    
    try:
        print("Recognizing...")
        text = recognizer.recognize_google(audio, language="ko-KR")
        print(f"Recognized text: {text}")
        return text
    except sr.UnknownValueError:
        print("Could not understand the audio")
        return ""
    except sr.RequestError as e:
        print(f"Could not request results; {e}")
        return ""

def parse_order_text(text):
    add_pattern = r"더블 불고기 버거 (\d+)개 추가해줘"
    new_order_pattern = r"더블 불고기 버거 (\d+)개 담아줘"
    
    add_match = re.search(add_pattern, text)
    new_order_match = re.search(new_order_pattern, text)
    
    if add_match:
        count = int(add_match.group(1))
        return {"item": "더블 불고기 버거", "count": count, "type": "add"}
    elif new_order_match:
        count = int(new_order_match.group(1))
        return {"item": "더블 불고기 버거", "count": count, "type": "new"}
    else:
        return {"item": "더블 불고기 버거", "count": 1, "type": "new"}

@app.route('/recognize', methods=['POST'])
def recognize():
    result_event = threading.Event()
    response_queue = []

    def handle_recognition():
        with app.app_context():
            start_time = time.time()
            recognized_text = recognize_speech_from_mic()
            if recognized_text in cache:
                order = cache[recognized_text]
            else:
                order = parse_order_text(recognized_text)
                cache[recognized_text] = order
            response_queue.append(jsonify(order))
            end_time = time.time()
            print(f"Recognition and processing took {end_time - start_time} seconds")
            result_event.set()

    recognition_thread = threading.Thread(target=handle_recognition)
    recognition_thread.start()
    result_event.wait()  # 스레드가 작업을 완료할 때까지 대기
    
    if response_queue:
        return response_queue[0]
    else:
        return jsonify({"error": "Recognition failed"}), 500

if __name__ == "__main__":
    app.run(port=5001)