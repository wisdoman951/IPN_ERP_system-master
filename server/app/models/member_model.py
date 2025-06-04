import pymysql
from app.config import DB_CONFIG


def connect_to_db():
    return pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

def get_all_members():
    conn = connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute("""
            SELECT member_id, name, birthday, address, phone, gender, blood_type,
                   line_id, inferrer_id, occupation, note
            FROM member
        """)
        result = cursor.fetchall()
    conn.close()
    return result

def search_members(keyword):
    conn = connect_to_db()
    with conn.cursor() as cursor:
        like = f"%{keyword}%"
        cursor.execute("""
            SELECT member_id, name, birthday, address, phone, gender, blood_type,
                   line_id, inferrer_id, occupation, note
            FROM member
            WHERE name LIKE %s OR phone LIKE %s OR member_id LIKE %s
        """, (like, like, like))
        result = cursor.fetchall()
    conn.close()
    return result

def create_member(data):
    conn = connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute("""
            INSERT INTO member (
                name, birthday, address, phone, gender,
                blood_type, line_id, inferrer_id, occupation, note
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data.get("name"),
            data.get("birthday"),
            data.get("address"),
            data.get("phone"),
            data.get("gender"),
            data.get("blood_type"),
            data.get("line_id"),
            data.get("inferrer_id"),
            data.get("occupation"),
            data.get("note")
        ))
    conn.commit()
    conn.close()

def delete_member(member_id):
    conn = connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM member WHERE member_id = %s", (member_id,))
    conn.commit()
    conn.close()

def update_member(member_id, data):
    conn = connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute("""
            UPDATE member SET
                name=%s, birthday=%s, address=%s, phone=%s, gender=%s,
                blood_type=%s, line_id=%s, inferrer_id=%s, occupation=%s, note=%s
            WHERE member_id = %s
        """, (
            data.get("name"),
            data.get("birthday"),
            data.get("address"),
            data.get("phone"),
            data.get("gender"),
            data.get("blood_type"),
            data.get("line_id"),
            data.get("inferrer_id"),
            data.get("occupation"),
            data.get("note"),
            member_id
        ))
    conn.commit()
    conn.close()

def get_member_by_id(member_id):
    conn = connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute("""
            SELECT member_id, name, birthday, address, phone, gender, blood_type,
                   line_id, inferrer_id, occupation, note
            FROM member
            WHERE member_id = %s
        """, (member_id,))
        result = cursor.fetchone()
    conn.close()
    return result

def check_member_exists(member_id):
    conn = connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) as count FROM member WHERE member_id = %s", (member_id,))
        result = cursor.fetchone()
    conn.close()
    return result["count"] > 0
