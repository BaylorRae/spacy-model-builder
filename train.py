#!/usr/bin/env python
# coding: utf8
"""Example of training an additional entity type

This script shows how to add a new entity type to an existing pretrained NER
model. To keep the example short and simple, only four sentences are provided
as examples. In practice, you'll need many more — a few hundred would be a
good start. You will also likely need to mix in examples of other entity
types, which might be obtained by running the entity recognizer over unlabelled
sentences, and adding their annotations to the training set.

The actual training is performed by looping over the examples, and calling
`nlp.entity.update()`. The `update()` method steps through the words of the
input. At each word, it makes a prediction. It then consults the annotations
provided on the GoldParse instance, to see whether it was right. If it was
wrong, it adjusts its weights so that the correct action will score higher
next time.

After training your model, you can save it to a directory. We recommend
wrapping models as Python packages, for ease of deployment.

For more details, see the documentation:
* Training: https://spacy.io/usage/training
* NER: https://spacy.io/usage/linguistic-features#named-entities

Compatible with: spaCy v2.1.0+
Last tested with: v2.2.4
"""
import sys
import random
import warnings
from pathlib import Path
import spacy
from spacy.util import minibatch, compounding
import requests

QUERY = """
query ($id: Int!) {
  dataset(id: $id) {
    id
    title
    
    texts(annotated: true) {
      id
      text
      
      annotations {
        id
        selectionStart
        selectionEnd
        
        entity {
          id
          title
        }
      }
    }
  }
}
"""

resp = requests.post('http://localhost:3000/graphql', json={
    'query': QUERY,
    'variables': {
        'id': int(sys.argv[1])
    }
})

TRAIN_DATA = [
    (
        text['text'],
        {
            "entities": [
                (annotation['selectionStart'], annotation['selectionEnd'], annotation['entity']['title'].upper())
                for annotation in text['annotations']
            ]
        },
    )
    for text in resp.json()['data']['dataset']['texts']
]


def main(model=None, new_model_name="animal", output_dir=None, n_iter=30):
    """Set up the pipeline and entity recognizer, and train the new entity."""
    random.seed(0)
    if model is not None:
        nlp = spacy.load(model)  # load existing spaCy model
        print("Loaded model '%s'" % model)
    else:
        nlp = spacy.blank("en")  # create blank Language class
        print("Created blank 'en' model")
    # Add entity recognizer to model if it's not in the pipeline
    # nlp.create_pipe works for built-ins that are registered with spaCy
    if "ner" not in nlp.pipe_names:
        ner = nlp.create_pipe("ner")
        nlp.add_pipe(ner)
    # otherwise, get it, so we can add labels to it
    else:
        ner = nlp.get_pipe("ner")

    for _, annotations in TRAIN_DATA:
        for ent in annotations.get("entities"):
            ner.add_label(ent[2])

    # Adding extraneous labels shouldn't mess anything up
    if model is None:
        optimizer = nlp.begin_training()
    else:
        optimizer = nlp.resume_training()

    move_names = list(ner.move_names)
    # get names of other pipes to disable them during training
    pipe_exceptions = ["ner", "trf_wordpiecer", "trf_tok2vec"]
    other_pipes = [pipe for pipe in nlp.pipe_names if pipe not in pipe_exceptions]
    # only train NER

    with nlp.disable_pipes(*other_pipes) and warnings.catch_warnings():
        # show warnings for misaligned entity spans once
        warnings.filterwarnings("once", category=UserWarning, module='spacy')

        # reset and initialize the weights randomly – but only if we're
        # training a new model
        if model is None:
            nlp.begin_training()
        for itn in range(n_iter):
            random.shuffle(TRAIN_DATA)
            losses = {}
            # batch up the examples using spaCy's minibatch
            batches = minibatch(TRAIN_DATA, size=compounding(4.0, 32.0, 1.001))
            for batch in batches:
                texts, annotations = zip(*batch)
                nlp.update(
                    texts,  # batch of texts
                    annotations,  # batch of annotations
                    drop=0.5,  # dropout - make it harder to memorise data
                    losses=losses,
                )
            print("Losses", losses)

    # with nlp.disable_pipes(*other_pipes) and warnings.catch_warnings():
    #     # show warnings for misaligned entity spans once
    #     warnings.filterwarnings("once", category=UserWarning, module='spacy')

    #     sizes = compounding(1.0, 4.0, 1.001)
    #     # batch up the examples using spaCy's minibatch
    #     for itn in range(n_iter):
    #         random.shuffle(TRAIN_DATA)
    #         batches = minibatch(TRAIN_DATA, size=sizes)
    #         losses = {}
    #         for batch in batches:
    #             texts, annotations = zip(*batch)
    #             nlp.update(texts, annotations, sgd=optimizer, drop=0.35, losses=losses)
    #         print("Losses", losses)

    # save model to output directory
    if output_dir is not None:
        output_dir = Path(output_dir)
        if not output_dir.exists():
            output_dir.mkdir()
        nlp.meta["name"] = new_model_name  # rename model
        nlp.to_disk(output_dir)
        print("Saved model to", output_dir)


if __name__ == "__main__":
    main(model=None,
         new_model_name='dataset-1',
         output_dir='./models',
         n_iter=100)
