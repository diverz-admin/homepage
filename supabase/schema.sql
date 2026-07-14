-- 문의(Contact) 테이블
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  created_at timestamptz not null default now()
);

-- RLS 활성화: 정책이 없으므로 anon/authenticated 키로는 아무것도 할 수 없다.
-- 서버(API Route)에서 service_role 키로만 insert 하므로 이 상태가 맞다.
alter table public.contacts enable row level security;

create index if not exists contacts_created_at_idx
  on public.contacts (created_at desc);
