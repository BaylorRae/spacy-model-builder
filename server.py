from flask import Flask, request
from flask_cors import CORS
import spacy

nlp = spacy.load('./models')
app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return 'Post to /annotate'

@app.route('/annotate', methods=['POST'])
def annotate():
    doc = nlp(request.form['text'])
    return {
        'entities': [
            {'text': ent.text,
             'label': ent.label_,
             'selectionStart': ent.start_char,
             'selectionEnd': ent.end_char}
            for ent in doc.ents
        ]
    }
