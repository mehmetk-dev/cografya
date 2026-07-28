update public.user_atlas_data as current_data
set revision = greatest(
  current_data.revision,
  coalesce(
    (
      select max(saved.revision) + 1
      from public.user_atlas_data_versions as saved
      where saved.user_id = current_data.user_id
    ),
    1
  )
);
