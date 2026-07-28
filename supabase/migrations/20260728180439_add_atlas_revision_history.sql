alter table public.user_atlas_data
  add column if not exists revision bigint not null default 1;

alter table public.user_atlas_data
  drop constraint if exists user_atlas_data_revision_check;

alter table public.user_atlas_data
  add constraint user_atlas_data_revision_check
  check (revision > 0);

create table if not exists public.user_atlas_data_versions (
  user_id uuid not null references auth.users (id) on delete cascade,
  revision bigint not null,
  data jsonb not null,
  saved_at timestamptz not null default now(),
  primary key (user_id, revision),
  constraint user_atlas_data_versions_object_check
    check (jsonb_typeof(data) = 'object'),
  constraint user_atlas_data_versions_size_check
    check (pg_column_size(data) <= 5242880)
);

comment on table public.user_atlas_data_versions is
  'Harita verisinin cihazlar arasi yazmalarda kaybolmamasi icin degistirilemez onceki surumleri.';

alter table public.user_atlas_data_versions enable row level security;
alter table public.user_atlas_data_versions force row level security;

revoke all on table public.user_atlas_data_versions from anon;
revoke all on table public.user_atlas_data_versions from authenticated;
grant select on table public.user_atlas_data_versions to authenticated;

drop policy if exists "Users can read their own atlas versions"
  on public.user_atlas_data_versions;

create policy "Users can read their own atlas versions"
on public.user_atlas_data_versions
for select
to authenticated
using ((select auth.uid()) = user_id);

insert into public.user_atlas_data_versions (user_id, revision, data, saved_at)
select user_id, revision, data, updated_at
from public.user_atlas_data
on conflict (user_id, revision) do nothing;

create or replace function public.archive_user_atlas_data_revision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.data is distinct from new.data then
    insert into public.user_atlas_data_versions (
      user_id,
      revision,
      data,
      saved_at
    )
    values (
      old.user_id,
      old.revision,
      old.data,
      old.updated_at
    )
    on conflict (user_id, revision) do nothing;
  end if;

  return new;
end;
$$;

revoke all on function public.archive_user_atlas_data_revision() from public;

drop trigger if exists archive_user_atlas_data_revision
  on public.user_atlas_data;

create trigger archive_user_atlas_data_revision
before update of data on public.user_atlas_data
for each row
execute function public.archive_user_atlas_data_revision();

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'user_atlas_data'
  ) then
    alter publication supabase_realtime
      add table public.user_atlas_data;
  end if;
end
$$;
