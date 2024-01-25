from datetime import datetime


def is_date_before_today(date_str):
    date_obj = datetime.strptime(date_str, "%d %m %Y")

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
    return date_of_birth_addresses

def old_card_number_pii(text,rules):
    card_number_rules = rules["Old Card Number France"]["regex"]
    card_number_addresses = re.findall(card_number_rules, text)
    card_number_addresses = list(set(filter(None, card_number_addresses)))
    return card_number_addresses

def count_word_occurrences(text):
    # Initialiser un dictionnaire pour stocker les occurrences de chaque mot
    word_occurrences = {}

    # Séparer le texte en mots
    words = text.split()

    # Parcourir chaque mot
    for word in words:
        # Supprimer la ponctuation éventuelle
        word = word.strip(".,!?")

        # Convertir le mot en minuscules pour éviter les doublons (casse insensible)
        word = word.lower()

        # Mettre à jour le dictionnaire des occurrences
        if word in word_occurrences:
            word_occurrences[word] += 1
        else:
            word_occurrences[word] = 1

    return word_occurrences


    
