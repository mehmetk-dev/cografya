create table public.user_atlas_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint user_atlas_data_object_check
    check (jsonb_typeof(data) = 'object'),
  constraint user_atlas_data_size_check
    check (pg_column_size(data) <= 5242880)
);

comment on table public.user_atlas_data is
  'Coğrafya Atlasım için kullanıcı başına tek, sürümlü cihaz senkronizasyonu kaydı.';

alter table public.user_atlas_data enable row level security;
alter table public.user_atlas_data force row level security;

revoke all on table public.user_atlas_data from anon;
revoke all on table public.user_atlas_data from authenticated;
grant select, insert, update on table public.user_atlas_data to authenticated;

create policy "Users can read their own atlas data"
on public.user_atlas_data
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own atlas data"
on public.user_atlas_data
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own atlas data"
on public.user_atlas_data
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
