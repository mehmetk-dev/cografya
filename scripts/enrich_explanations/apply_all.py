# -*- coding: utf-8 -*-
"""
Tüm Tarih, Coğrafya, Vatandaşlık ve Güncel Bilgiler açıklamalarını birleştirip src/questionsData.ts dosyasına uygulayan script.
"""

import os
import sys
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)

from batch_tarih_1_25 import EXPLANATIONS_TARIH_1_25
from batch_tarih_26_50 import EXPLANATIONS_TARIH_26_50
from batch_tarih_51_75 import EXPLANATIONS_TARIH_51_75
from batch_tarih_76_100 import EXPLANATIONS_TARIH_76_100
from batch_tarih_101_125 import EXPLANATIONS_TARIH_101_125
from batch_tarih_126_151 import EXPLANATIONS_TARIH_126_151
from batch_tarih_152_176 import EXPLANATIONS_TARIH_152_176

from batch_cografya_1_30 import EXPLANATIONS_COGRAFYA_1_30
from batch_cografya_31_60 import EXPLANATIONS_COGRAFYA_31_60
from batch_cografya_61_91 import EXPLANATIONS_COGRAFYA_61_91

from batch_vatandaslik_guncel import EXPLANATIONS_VATANDASLIK_GUNCEL

master_dict = {}

# Merge Tarih
tarih_batches = [
    EXPLANATIONS_TARIH_1_25,
    EXPLANATIONS_TARIH_26_50,
    EXPLANATIONS_TARIH_51_75,
    EXPLANATIONS_TARIH_76_100,
    EXPLANATIONS_TARIH_101_125,
    EXPLANATIONS_TARIH_126_151,
    EXPLANATIONS_TARIH_152_176
]

for b in tarih_batches:
    master_dict.update(b)

print(f"Toplam zenginleştirilmiş Tarih sorusu: {len([k for k in master_dict if k.startswith('tarih-')])}")

# Merge Coğrafya
cografya_batches = [
    EXPLANATIONS_COGRAFYA_1_30,
    EXPLANATIONS_COGRAFYA_31_60,
    EXPLANATIONS_COGRAFYA_61_91
]

for b in cografya_batches:
    master_dict.update(b)

print(f"Toplam zenginleştirilmiş Coğrafya sorusu: {len([k for k in master_dict if k.startswith('coğrafya-')])}")

# Merge Vatandaşlık & Güncel
master_dict.update(EXPLANATIONS_VATANDASLIK_GUNCEL)
print(f"Toplam zenginleştirilmiş Vatandaşlık sorusu: {len([k for k in master_dict if k.startswith('vatandaşlık-')])}")
print(f"Toplam zenginleştirilmiş Güncel Bilgiler sorusu: {len([k for k in master_dict if k.startswith('güncel-')])}")
print(f"Toplam master sözlük boyutu: {len(master_dict)}")

# Read target file
target_path = os.path.abspath(os.path.join(BASE_DIR, "../../src/questionsData.ts"))
with open(target_path, "r", encoding="utf-8") as f:
    content = f.read()

prefix = "export const ALL_QUESTIONS_DATA: QuestionItem[] = "
start_idx = content.find(prefix)
if start_idx == -1:
    raise ValueError("Prefix not found in questionsData.ts")

header = content[:start_idx + len(prefix)]

# Find closing bracket of array
end_idx = content.rfind("];")
if end_idx == -1:
    raise ValueError("Closing array bracket not found in questionsData.ts")

json_str = content[start_idx + len(prefix):end_idx + 1]
questions = json.loads(json_str)

print(f"questionsData.ts içindeki toplam soru sayısı: {len(questions)}")

# Update explanations
updated_count = 0
for q in questions:
    qid = q.get("id")
    if qid in master_dict:
        q["explanation"] = master_dict[qid]
        updated_count += 1

print(f"Başarıyla güncellenen soru sayısı: {updated_count}")

# Serialize back
new_json_str = json.dumps(questions, indent=2, ensure_ascii=False)
new_content = header + new_json_str + ";\n"

# Write new file
with open(target_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"questionsData.ts başarıyla güncellendi! ({target_path})")
