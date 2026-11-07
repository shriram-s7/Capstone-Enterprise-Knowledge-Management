from datetime import datetime, timezone

DEMO_DEPARTMENTS = [
    {
        "id": "DEP-SEC",
        "department_name": "Information Security & Compliance",
        "department_code": "INFOSEC",
        "department_head_id": "usr-admin"
    },
    {
        "id": "DEP-EXEC",
        "department_name": "Executive Office",
        "department_code": "EXEC",
        "department_head_id": "usr-exec"
    },
    {
        "id": "DEP-ENG",
        "department_name": "Software Engineering & AI",
        "department_code": "ENG",
        "department_head_id": "usr-head"
    },
    {
        "id": "DEP-OPS",
        "department_name": "Global Operations & Trading",
        "department_code": "OPS",
        "department_head_id": None
    },
    {
        "id": "DEP-HR",
        "department_name": "Human Resources & Talent",
        "department_code": "HR",
        "department_head_id": None
    },
    {
        "id": "DEP-FIN",
        "department_name": "Corporate Finance & Treasury",
        "department_code": "FIN",
        "department_head_id": None
    }
]

# Demo credentials for local evaluation (distinct, strong passwords)
DEMO_USERS = [
    {
        "id": "usr-admin",
        "employee_id": "FN-00001",
        "full_name": "Alex Vance",
        "corporate_email": "admin@finnova.demo",
        "password_plaintext": "Admin!FinNova2026#Secure",
        "role": "SUPER_ADMIN",
        "department_id": "DEP-SEC",
        "manager_id": None
    },
    {
        "id": "usr-exec",
        "employee_id": "FN-00100",
        "full_name": "Victoria Sterling",
        "corporate_email": "executive@finnova.demo",
        "password_plaintext": "Exec!Sterling2026#Chief",
        "role": "EXECUTIVE",
        "department_id": "DEP-EXEC",
        "manager_id": None
    },
    {
        "id": "usr-head",
        "employee_id": "FN-00200",
        "full_name": "Marcus Chen",
        "corporate_email": "head@finnova.demo",
        "password_plaintext": "Head!Engineering2026#Lead",
        "role": "DEPARTMENT_HEAD",
        "department_id": "DEP-ENG",
        "manager_id": "usr-exec"
    },
    {
        "id": "usr-mgr",
        "employee_id": "FN-00300",
        "full_name": "Elena Rostova",
        "corporate_email": "manager@finnova.demo",
        "password_plaintext": "Mgr!InfraTeam2026#Track",
        "role": "MANAGER",
        "department_id": "DEP-ENG",
        "manager_id": "usr-head"
    },
    {
        "id": "usr-emp",
        "employee_id": "FN-00400",
        "full_name": "David Kim",
        "corporate_email": "employee@finnova.demo",
        "password_plaintext": "Emp!DavidKim2026#Access",
        "role": "EMPLOYEE",
        "department_id": "DEP-ENG",
        "manager_id": "usr-mgr"
    },
    {
        "id": "usr-audit",
        "employee_id": "FN-00500",
        "full_name": "Sophia Bennett",
        "corporate_email": "auditor@finnova.demo",
        "password_plaintext": "Audit!Bennett2026#Verify",
        "role": "AUDITOR",
        "department_id": "DEP-SEC",
        "manager_id": "usr-exec"
    }
]
