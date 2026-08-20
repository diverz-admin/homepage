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

-- 간편 문의 폼 개편: 이메일 대신 연락처를 받고, 문의유형(다중선택)·예산·
-- 개인정보 동의 여부를 추가로 받는다. 자유 문의 내용 필드는 없앤다.
-- 기존 email/message는 과거 문의 데이터 보존을 위해 컬럼은 남기고
-- NOT NULL만 풀어서, 새 폼 제출 시 비워 둘 수 있게 한다(값 손실 없는
-- 되돌릴 수 있는 변경).
alter table public.contacts
  add column if not exists phone text,
  add column if not exists inquiry_types text[] not null default '{}',
  add column if not exists budget text,
  add column if not exists consent boolean not null default false;

alter table public.contacts
  alter column email drop not null,
  alter column message drop not null;
