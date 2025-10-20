#!/bin/bash

# Script d'entrée pour le conteneur Django

echo "🔄 Attente de la base de données PostgreSQL..."

# Attendre que PostgreSQL soit prêt
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 0.1
done

echo "✅ PostgreSQL est prêt!"

echo "🔄 Application des migrations de base de données..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "🔄 Collecte des fichiers statiques..."
python manage.py collectstatic --noinput

echo "🔄 Création du superutilisateur..."
python manage.py shell << END
from django.contrib.auth import get_user_model
import os

User = get_user_model()
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123')

if not User.objects.filter(email=email).exists():
    User.objects.create_superuser(email=email, nom=username, password=password)
    print(f'✅ Superutilisateur {username} créé avec succès!')
else:
    print(f'ℹ️  Superutilisateur {email} existe déjà.')
END

echo "🚀 Démarrage du serveur Django..."
exec python manage.py runserver 0.0.0.0:8000

