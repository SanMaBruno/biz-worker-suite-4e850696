#!/bin/bash

# Script to setup Supabase database

echo "🔧 Setting up Supabase database..."
echo ""

# Load environment
export $(cat .env | grep -v '^#' | xargs)

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    brew install supabase/tap/supabase
fi

echo "🗂️  Applying migrations..."
# First, let's check the status
supabase status

echo ""
echo "📝 To apply migrations to your remote Supabase project:"
echo "1. Visit: https://app.supabase.com/project/kttbmxpmvmsakxfbelen/sql/new"
echo "2. Copy and paste the contents of:"
echo "   - supabase/migrations/20260320184232_08b6f801-c7ff-45e9-b6f1-2709a71e9a7b.sql"
echo "   - supabase/migrations/20260320184244_d07abe37-0e83-4d40-b8b3-882fd7504400.sql"
echo "3. Run the SQL"
echo ""
echo "🌱 Then populate data by running:"
echo "npm run seed"
echo ""
echo "✅ After that, you can login with:"
echo "  - admin@empresa.cl / admin123"
echo "  - rrhh@empresa.cl / rrhh123"
echo "  - finanzas@empresa.cl / finanzas123"
echo "  - juan.perez@empresa.cl / trabajador123"
