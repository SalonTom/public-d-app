import pytesseract, re, json, nltk, itertools, spacy, difflib, math
from datetime import datetime

def string_tokenizer(text):
    final_word_list = []
    words_list = text.replace(" ", "\n").split("\n")

    for element in words_list:
        if len(element) >= 2:
            final_word_list.append(element)

    return final_word_list

def is_date_before_today(date_str):
    date_obj = datetime.strptime(date_str, "%d %m %Y")

    date_today = datetime.now().date()

    return date_obj.date() < date_today

def is_old_date_before_today(date_str):
    date_obj = datetime.strptime(date_str, "%d.%m.%Y")

    date_today = datetime.now().date()

    return date_obj.date() < date_today

def get_regexes():
    with open('definitions.json', "r", encoding='utf-8') as json_file:
        _rules = json.load(json_file)
        return _rules

def date_of_birth_pii(text,rules):
    date_of_birth_rules = rules["Date of Birth"]["regex"]
    date_of_birth_addresses = re.findall(date_of_birth_rules, text)
    date_of_birth_addresses = list(set(filter(None, date_of_birth_addresses)))
    res = []
    for date in date_of_birth_addresses:
        if is_date_before_today(date):
            res.append(date)
    return res

def card_number_pii(text,rules):
    card_number_rules = rules["Card Number France"]["regex"]
    card_number_addresses = re.findall(card_number_rules, text)
    card_number_addresses = list(set(filter(None, card_number_addresses)))
    return card_number_addresses

def old_date_of_birth_pii(text,rules):
    date_of_birth_rules = rules["Old Date of Birth"]["regex"]
    date_of_birth_addresses = re.findall(date_of_birth_rules, text)
    date_of_birth_addresses = list(set(filter(None, date_of_birth_addresses)))
    res = []
    for date in date_of_birth_addresses:
        if is_old_date_before_today(date):
            res.append(date)
    return res

def old_card_number_pii(text,rules):
    card_number_rules = rules["Old Card Number France"]["regex"]
    card_number_addresses = re.findall(card_number_rules, text)
    card_number_addresses = list(set(filter(None, card_number_addresses)))
    return card_number_addresses

# Renvoie une map du nombre d'occurences par mot qui est détecté dans le texte
def count_word_occurrences(text):
    word_occurrences = {}

    words = text.split()

    for word in words:
        word = word.strip(".,!?")

        word = word.lower()

        if word in word_occurrences:
            word_occurrences[word] += 1
        else:
            word_occurrences[word] = 1

    return word_occurrences


    
