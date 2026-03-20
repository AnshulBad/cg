import uuid
import random
import datetime
from database import SessionLocal, PlayerStat, PlayerProfile

def seed_npcs():
    db = SessionLocal()
    npc_names = [
        'Annie Verma', 'Manjot Singh', 'Vaibhav Batra', 
        'Saryu Agnihotri', 'Tarinder Singh', 'Arjun', 'Isha', 
        'Vikram', 'Meera', 'Neha', 'Kabir', 'Rohan', 'Aditi', 
        'Priya', 'Raj', 'Sunita', 'Amit', 'Kavita', 'Prakash',
        'Suresh', 'Anupama', 'Deepak', 'Madhu'
    ]
    domains = ['cyber', 'posh', 'business']

    try:
        for name in npc_names:
            # Check if NPC profile exists
            profile = db.query(PlayerProfile).filter(PlayerProfile.username == name).first()
            if not profile:
                profile = PlayerProfile(
                    id=str(uuid.uuid4()),
                    username=name,
                    parent_name="NPC System",
                    session_token="npc-token-" + str(uuid.uuid4())[:8]
                )
                db.add(profile)
            
            # Check if NPC stats exist for each domain or just a main one
            # For simplicity, we'll give each NPC 1-2 domains they are "good" at
            assigned_domains = random.sample(domains, random.randint(1, 2))
            
            for domain in assigned_domains:
                stat = db.query(PlayerStat).filter(
                    PlayerStat.username == name,
                    PlayerStat.domain == domain
                ).first()
                
                if not stat:
                    total = random.randint(15, 45)
                    correct = int(total * random.uniform(0.65, 0.95))
                    score = correct * 10
                    accuracy = round((correct / total) * 100, 1)
                    
                    stat = PlayerStat(
                        username=name,
                        domain=domain,
                        correct=correct,
                        total=total,
                        score=score,
                        accuracy=accuracy,
                        playtime_seconds=total * random.randint(30, 90),
                        highest_level=random.randint(2, 3),
                        played_at=datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(0, 5))
                    )
                    db.add(stat)
                else:
                    # Update existing NPC stats to look fresh
                    stat.played_at = datetime.datetime.utcnow()
            
        db.commit()
        print(f"Successfully seeded {len(npc_names)} NPCs into the database.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding NPCs: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_npcs()
