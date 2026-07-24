


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."frequencia_recorrencia" AS ENUM (
    'semanal',
    'mensal',
    'anual'
);


ALTER TYPE "public"."frequencia_recorrencia" OWNER TO "postgres";


CREATE TYPE "public"."status_transacao" AS ENUM (
    'pendente',
    'pago'
);


ALTER TYPE "public"."status_transacao" OWNER TO "postgres";


CREATE TYPE "public"."tipo_pessoa_enum" AS ENUM (
    'PF',
    'PJ'
);


ALTER TYPE "public"."tipo_pessoa_enum" OWNER TO "postgres";


CREATE TYPE "public"."tipo_transacao" AS ENUM (
    'receita',
    'despesa'
);


ALTER TYPE "public"."tipo_transacao" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."cartoes_credito" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "nome" character varying(50) NOT NULL,
    "dia_fechamento" integer NOT NULL,
    "dia_vencimento" integer NOT NULL,
    "conta_pagamento_padrao_id" "uuid",
    "limite" numeric(10,2) DEFAULT 0.00 NOT NULL,
    CONSTRAINT "cartoes_credito_dia_fechamento_check" CHECK ((("dia_fechamento" >= 1) AND ("dia_fechamento" <= 31))),
    CONSTRAINT "cartoes_credito_dia_vencimento_check" CHECK ((("dia_vencimento" >= 1) AND ("dia_vencimento" <= 31)))
);


ALTER TABLE "public"."cartoes_credito" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."categorias" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nome" "text" NOT NULL,
    "tipo" "text" NOT NULL,
    "parent_id" "uuid",
    "icone" "text" DEFAULT 'Folder'::"text",
    "criado_em" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "categorias_tipo_check" CHECK (("tipo" = ANY (ARRAY['RECEITA'::"text", 'DESPESA'::"text"])))
);


ALTER TABLE "public"."categorias" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contas_bancarias" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "banco" character varying(100) NOT NULL,
    "tipo_pessoa" "public"."tipo_pessoa_enum" NOT NULL,
    "titularidade" character(1) NOT NULL,
    "apelido" character varying(100) NOT NULL,
    "saldo_inicial" numeric(12,2) DEFAULT 0.00,
    "criado_em" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "contas_bancarias_titularidade_check" CHECK (("titularidade" = ANY (ARRAY['I'::"bpchar", 'C'::"bpchar"])))
);


ALTER TABLE "public"."contas_bancarias" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."faturas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "cartao_credito_id" "uuid",
    "ano" integer NOT NULL,
    "mes" integer NOT NULL,
    "status" character varying(20) DEFAULT 'ABERTA'::character varying NOT NULL,
    "data_pagamento" "date",
    "conta_pagamento_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."faturas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lancamentos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "descricao" "text" NOT NULL,
    "valor" numeric(10,2) NOT NULL,
    "data" "date" DEFAULT CURRENT_DATE NOT NULL,
    "tipo_pessoa" "text" DEFAULT 'PF'::"text" NOT NULL,
    "conta_id" "uuid" NOT NULL,
    "categoria_id" "uuid" NOT NULL,
    "criado_em" timestamp with time zone DEFAULT "now"(),
    "tipo" "text" DEFAULT 'DESPESA'::"text" NOT NULL,
    "meio_pagamento" "text" DEFAULT 'CONTA'::"text" NOT NULL,
    "parcelas" integer DEFAULT 1 NOT NULL,
    "criado_por_nome" character varying(100),
    CONSTRAINT "lancamentos_meio_pagamento_check" CHECK (("meio_pagamento" = ANY (ARRAY['CONTA'::"text", 'CARTAO'::"text"]))),
    CONSTRAINT "lancamentos_tipo_check" CHECK (("tipo" = ANY (ARRAY['RECEITA'::"text", 'DESPESA'::"text"]))),
    CONSTRAINT "lancamentos_tipo_pessoa_check" CHECK (("tipo_pessoa" = ANY (ARRAY['PF'::"text", 'PJ'::"text"])))
);


ALTER TABLE "public"."lancamentos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."recorrencias" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "descricao" character varying(150) NOT NULL,
    "valor" numeric(12,2) NOT NULL,
    "categoria_id" "uuid" NOT NULL,
    "frequencia" "public"."frequencia_recorrencia" DEFAULT 'mensal'::"public"."frequencia_recorrencia",
    "dia_vencimento" integer NOT NULL,
    "ativa" boolean DEFAULT true,
    "criado_por" "uuid" NOT NULL,
    "criado_em" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "recorrencias_dia_vencimento_check" CHECK ((("dia_vencimento" >= 1) AND ("dia_vencimento" <= 31)))
);


ALTER TABLE "public"."recorrencias" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."transacoes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "descricao" character varying(150) NOT NULL,
    "valor" numeric(12,2) NOT NULL,
    "tipo" "public"."tipo_transacao" NOT NULL,
    "status" "public"."status_transacao" DEFAULT 'pago'::"public"."status_transacao",
    "data_competencia" "date" NOT NULL,
    "data_pagamento" timestamp with time zone,
    "categoria_id" "uuid" NOT NULL,
    "conta_bancaria_id" "uuid",
    "cartao_credito_id" "uuid",
    "recorrencia_origem_id" "uuid",
    "numero_parcela" integer DEFAULT 1,
    "total_parcelas" integer DEFAULT 1,
    "criado_por" "uuid",
    "criado_em" timestamp with time zone DEFAULT "now"(),
    "atualizado_em" timestamp with time zone DEFAULT "now"(),
    "lancamento_id" "uuid",
    "fatura_id" "uuid",
    "criado_por_nome" character varying(100)
);


ALTER TABLE "public"."transacoes" OWNER TO "postgres";


ALTER TABLE ONLY "public"."cartoes_credito"
    ADD CONSTRAINT "cartoes_credito_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categorias"
    ADD CONSTRAINT "categorias_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contas_bancarias"
    ADD CONSTRAINT "contas_bancarias_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."faturas"
    ADD CONSTRAINT "faturas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lancamentos"
    ADD CONSTRAINT "lancamentos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."recorrencias"
    ADD CONSTRAINT "recorrencias_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."transacoes"
    ADD CONSTRAINT "transacoes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."faturas"
    ADD CONSTRAINT "unique_fatura_cartao_periodo" UNIQUE ("cartao_credito_id", "ano", "mes");



ALTER TABLE ONLY "public"."categorias"
    ADD CONSTRAINT "unique_id_tipo" UNIQUE ("id", "tipo");



ALTER TABLE ONLY "public"."categorias"
    ADD CONSTRAINT "unique_nome_por_nivel" UNIQUE ("nome", "parent_id");



ALTER TABLE ONLY "public"."cartoes_credito"
    ADD CONSTRAINT "cartoes_credito_conta_pagamento_padrao_id_fkey" FOREIGN KEY ("conta_pagamento_padrao_id") REFERENCES "public"."contas_bancarias"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."faturas"
    ADD CONSTRAINT "faturas_cartao_id_fkey" FOREIGN KEY ("cartao_credito_id") REFERENCES "public"."cartoes_credito"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."faturas"
    ADD CONSTRAINT "faturas_conta_pagamento_id_fkey" FOREIGN KEY ("conta_pagamento_id") REFERENCES "public"."contas_bancarias"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."categorias"
    ADD CONSTRAINT "fk_parent_id_tipo" FOREIGN KEY ("parent_id", "tipo") REFERENCES "public"."categorias"("id", "tipo") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lancamentos"
    ADD CONSTRAINT "lancamentos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."transacoes"
    ADD CONSTRAINT "transacoes_cartao_credito_id_fkey" FOREIGN KEY ("cartao_credito_id") REFERENCES "public"."cartoes_credito"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."transacoes"
    ADD CONSTRAINT "transacoes_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."transacoes"
    ADD CONSTRAINT "transacoes_conta_bancaria_id_fkey" FOREIGN KEY ("conta_bancaria_id") REFERENCES "public"."contas_bancarias"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."transacoes"
    ADD CONSTRAINT "transacoes_fatura_id_fkey" FOREIGN KEY ("fatura_id") REFERENCES "public"."faturas"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."transacoes"
    ADD CONSTRAINT "transacoes_lancamento_id_fkey" FOREIGN KEY ("lancamento_id") REFERENCES "public"."lancamentos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."transacoes"
    ADD CONSTRAINT "transacoes_recorrencia_origem_id_fkey" FOREIGN KEY ("recorrencia_origem_id") REFERENCES "public"."recorrencias"("id") ON DELETE SET NULL;



CREATE POLICY "Acesso total autenticado" ON "public"."cartoes_credito" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Acesso total autenticado" ON "public"."categorias" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Acesso total autenticado" ON "public"."contas_bancarias" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Acesso total autenticado" ON "public"."faturas" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Acesso total autenticado" ON "public"."lancamentos" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Acesso total autenticado" ON "public"."recorrencias" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Acesso total autenticado" ON "public"."transacoes" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Acesso total para usuários autenticados" ON "public"."cartoes_credito" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Acesso total para usuários autenticados" ON "public"."categorias" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Acesso total para usuários autenticados" ON "public"."contas_bancarias" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Acesso total para usuários autenticados" ON "public"."faturas" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Acesso total para usuários autenticados" ON "public"."lancamentos" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Acesso total para usuários autenticados" ON "public"."recorrencias" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Acesso total para usuários autenticados" ON "public"."transacoes" TO "authenticated" USING (true) WITH CHECK (true);



ALTER TABLE "public"."cartoes_credito" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."categorias" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contas_bancarias" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."faturas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lancamentos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."recorrencias" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."transacoes" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";





































































































































































GRANT ALL ON TABLE "public"."cartoes_credito" TO "service_role";
GRANT ALL ON TABLE "public"."cartoes_credito" TO "authenticated";



GRANT ALL ON TABLE "public"."categorias" TO "anon";
GRANT ALL ON TABLE "public"."categorias" TO "authenticated";
GRANT ALL ON TABLE "public"."categorias" TO "service_role";



GRANT ALL ON TABLE "public"."contas_bancarias" TO "service_role";
GRANT ALL ON TABLE "public"."contas_bancarias" TO "authenticated";



GRANT ALL ON TABLE "public"."faturas" TO "service_role";
GRANT ALL ON TABLE "public"."faturas" TO "authenticated";



GRANT ALL ON TABLE "public"."lancamentos" TO "anon";
GRANT ALL ON TABLE "public"."lancamentos" TO "authenticated";
GRANT ALL ON TABLE "public"."lancamentos" TO "service_role";



GRANT ALL ON TABLE "public"."recorrencias" TO "anon";
GRANT ALL ON TABLE "public"."recorrencias" TO "authenticated";
GRANT ALL ON TABLE "public"."recorrencias" TO "service_role";



GRANT ALL ON TABLE "public"."transacoes" TO "service_role";
GRANT ALL ON TABLE "public"."transacoes" TO "authenticated";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































