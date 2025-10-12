
create table "public"."resumes" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "user_id" uuid not null default auth.uid(),
    "is_default" boolean not null default false,
    "content" jsonb not null
);


alter table "public"."resumes" enable row level security;

CREATE UNIQUE INDEX resumes_pkey ON public.resumes USING btree (id);

alter table "public"."resumes" add constraint "resumes_pkey" PRIMARY KEY using index "resumes_pkey";

alter table "public"."resumes" add constraint "resumes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."resumes" validate constraint "resumes_user_id_fkey";

grant delete on table "public"."resumes" to "anon";

grant insert on table "public"."resumes" to "anon";

grant references on table "public"."resumes" to "anon";

grant select on table "public"."resumes" to "anon";

grant trigger on table "public"."resumes" to "anon";

grant truncate on table "public"."resumes" to "anon";

grant update on table "public"."resumes" to "anon";

grant delete on table "public"."resumes" to "authenticated";

grant insert on table "public"."resumes" to "authenticated";

grant references on table "public"."resumes" to "authenticated";

grant select on table "public"."resumes" to "authenticated";

grant trigger on table "public"."resumes" to "authenticated";

grant truncate on table "public"."resumes" to "authenticated";

grant update on table "public"."resumes" to "authenticated";

grant delete on table "public"."resumes" to "service_role";

grant insert on table "public"."resumes" to "service_role";

grant references on table "public"."resumes" to "service_role";

grant select on table "public"."resumes" to "service_role";

grant trigger on table "public"."resumes" to "service_role";

grant truncate on table "public"."resumes" to "service_role";

grant update on table "public"."resumes" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."resumes"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for authenticated users only"
on "public"."resumes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable users to update their own data only"
on "public"."resumes"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check (true);


create policy "Enable users to view their own data only"
on "public"."resumes"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));
