#!/bin/bash
# Supabase 키를 입력받아 .env.local 을 만든다. 키는 화면에 표시되지 않는다.
set -e
cd "$(dirname "$0")/.."

SUPABASE_URL="https://uqpbfajmkkepinssfuae.supabase.co"

echo "Supabase service_role 키를 붙여넣고 엔터를 누르세요."
echo "(대시보드 > Project Settings > API Keys > service_role)"
echo "입력한 키는 화면에 보이지 않습니다."
printf "service_role key: "
read -rs SERVICE_KEY
echo

if [ -z "$SERVICE_KEY" ]; then
  echo "키가 입력되지 않았습니다. 중단합니다."
  exit 1
fi

cat > .env.local <<EOF
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
SUPABASE_SERVICE_ROLE_KEY=${SERVICE_KEY}
EOF

chmod 600 .env.local
echo "✅ .env.local 생성 완료 (${#SERVICE_KEY}자 키 저장됨)"
