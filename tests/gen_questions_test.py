import unittest
import flask.code

class TestQuestionGeneration(unittest.TestCase):

    def test_artists(self):
       f = open("questions.json")
       questions = flask.code.generate_artist_questions(json.loads(f.read())
       for question in questions:
           self.assertTrue(question['answer'] in question['choices'])
           self.assertTrue(len(question['choices']) == 4)
       f.close()

    def test_release_dates(self):
        f = open("questions.json")
        questions = flask.code.generate_release_dates_questions(json.loads(f.read())
        for question in questions:
            self.assert(question['answer'] in question['choices'])
            self.assert(len(question['choices']) == 4)
            for choice in choices:
                self.assert(choice <= 2021)
        f.close()

    def test_generate_top_track_questions(self):
        f = open("questions.json")
        questions = flask.code.generate_top_track_questions(json.loads(f.read())
            for question in questions:
                self.assert(question['answer'] in question['choices'])
                self.assert(len(question['choices']) == 4)
        f.close()

if __name__ == '__main__':
    unittest.main()
