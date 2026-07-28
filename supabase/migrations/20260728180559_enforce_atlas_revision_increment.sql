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

    new.revision := old.revision + 1;
  end if;

  return new;
end;
$$;

revoke all on function public.archive_user_atlas_data_revision() from public;
