--- CREATION DES TABLES ---
-- 1. Création d'un type pour sécuriser les rôles 
CREATE TYPE user_role AS ENUM ('agent', 'client');

-- 2. Création de la table PROFILES 
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    firstname TEXT,
    lastname TEXT
);

-- 3. Création de la table PROPERTIES
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    city TEXT NOT NULL,
    agent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

--- CONFIG RLS ---
-- Activer le RLS sur les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- POLITIQUES POUR LA TABLE 'PROFILES'
-- Chaque utilisateur peut lire UNIQUEMENT son propre profil
CREATE POLICY "L'utilisateur peut voir son propre profil" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- POLITIQUES POUR LA TABLE 'PROPERTIES'
-- Les clients peuvent lire UNIQUEMENT les biens publiés
CREATE POLICY "Les clients voient les biens publiés" 
ON properties FOR SELECT 
USING (is_published = true);

-- Les agents peuvent créer leurs propres biens
CREATE POLICY "Les agents peuvent créer leurs biens" 
ON properties FOR INSERT 
WITH CHECK (auth.uid() = agent_id);

-- Les agents peuvent modifier UNIQUEMENT leurs propres biens 
CREATE POLICY "Les agents modifient leurs propres biens" 
ON properties FOR UPDATE 
USING (auth.uid() = agent_id);

-- Les agents peuvent voir leurs propres biens
CREATE POLICY "Les agents voient leurs propres biens" 
ON properties FOR SELECT 
USING (auth.uid() = agent_id);

--- CREATION DES DONNEES ---
INSERT INTO profiles (id, role, firstname, lastname)
VALUES ('2537af02-b352-4efd-8b74-b88bd146337f', 'agent', 'Jean', 'Paul');

INSERT INTO profiles (id, role, firstname, lastname)
VALUES ('b2a55e61-b1f7-4581-8ecc-7171dbbfa5c7', 'client', 'Doe', 'Robinson');

INSERT INTO properties (title, description, price, city, agent_id, is_published)
VALUES 
('Appartement Vue Mer', 'Superbe T3', 450000, 'Nice', '2537af02-b352-4efd-8b74-b88bd146337f', true),
('Studio Centre-ville', 'Idéal investisseur', 120000, 'Paris', '2537af02-b352-4efd-8b74-b88bd146337f', true),
('Maison de ville', 'Proche commerces', 350000, 'Paris', '2537af02-b352-4efd-8b74-b88bd146337f', true),
('Villa avec piscine', 'Grand terrain', 850000, 'Lyon', '2537af02-b352-4efd-8b74-b88bd146337f', true);