# Utiliser Python 3.12 comme image de base
FROM python:3.12-slim

# Définir les variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Créer et définir le répertoire de travail
WORKDIR /app

# Installer les dépendances système nécessaires pour PostgreSQL
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Copier le fichier requirements.txt
COPY requirements.txt /app/

# Installer les dépendances Python
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copier le reste du code de l'application
COPY . /app/

# Créer un répertoire pour les fichiers statiques
RUN mkdir -p /app/staticfiles

# Exposer le port 8000
EXPOSE 8000

# Rendre le script d'entrée exécutable
RUN chmod +x /app/entrypoint.sh

# Définir le script d'entrée
ENTRYPOINT ["/app/entrypoint.sh"]

