-- Создание таблицы bankruptcy_cases (Дела о банкротстве)
CREATE TABLE bankruptcy_cases (
    id SERIAL PRIMARY KEY,
    case_number VARCHAR(255) NOT NULL UNIQUE,
    debtor_name VARCHAR(500),
    start_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    assigned_au_id INTEGER,
    assigned_pau_id INTEGER,
    partner_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы users (Пользователи)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    patronymic VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы debtors (Должники)
CREATE TABLE debtors (
    id SERIAL PRIMARY KEY,
    case_id INTEGER NOT NULL REFERENCES bankruptcy_cases(id) ON DELETE CASCADE,
    last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    patronymic VARCHAR(255),
    birth_date DATE,
    birth_place TEXT,
    citizenship VARCHAR(100) DEFAULT 'РФ',
    snils_number VARCHAR(14),
    inn_number VARCHAR(12),
    passport_series VARCHAR(4),
    passport_number VARCHAR(6),
    passport_issued_by TEXT,
    passport_issue_date DATE,
    passport_department_code VARCHAR(7),
    passport_registration_address TEXT,
    actual_address TEXT,
    phone_number VARCHAR(50),
    email_address VARCHAR(255),
    region_code VARCHAR(20),
    marital_status VARCHAR(50),
    dependents_count INTEGER DEFAULT 0,
    is_deceased BOOLEAN DEFAULT FALSE,
    death_date DATE,
    is_retired BOOLEAN DEFAULT FALSE,
    is_disabled BOOLEAN DEFAULT FALSE,
    disability_group INTEGER,
    employment_status VARCHAR(100),
    workplace VARCHAR(255),
    workplace_inn VARCHAR(10),
    position VARCHAR(255),
    monthly_income DECIMAL(15, 2),
    bank_name VARCHAR(255),
    bank_bik VARCHAR(9),
    bank_account VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы documents (Документы)
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    case_id INTEGER REFERENCES bankruptcy_cases(id) ON DELETE CASCADE,
    debtor_id INTEGER REFERENCES debtors(id) ON DELETE CASCADE,
    uploaded_by_id INTEGER REFERENCES users(id),
    original_name VARCHAR(500) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    type VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    issuer VARCHAR(500),
    issue_date DATE,
    document_number VARCHAR(100),
    description TEXT,
    ai_processed BOOLEAN DEFAULT FALSE,
    ai_processing_result JSONB,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы document_attachments (Связи документов)
CREATE TABLE document_attachments (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    source_table VARCHAR(100) NOT NULL,
    source_record_id INTEGER NOT NULL,
    source_field VARCHAR(100),
    verified BOOLEAN DEFAULT FALSE,
    attached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attached_by_id INTEGER REFERENCES users(id)
);

-- Создание таблицы dependents (Иждивенцы)
CREATE TABLE dependents (
    id SERIAL PRIMARY KEY,
    debtor_id INTEGER NOT NULL REFERENCES debtors(id) ON DELETE CASCADE,
    last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    patronymic VARCHAR(255),
    birth_date DATE NOT NULL,
    relation_degree VARCHAR(100),
    age_group VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы spouses (Супруги)
CREATE TABLE spouses (
    id SERIAL PRIMARY KEY,
    debtor_id INTEGER NOT NULL UNIQUE REFERENCES debtors(id) ON DELETE CASCADE,
    last_name VARCHAR(255),
    first_name VARCHAR(255),
    patronymic VARCHAR(255),
    birth_date DATE,
    snils_number VARCHAR(14),
    inn_number VARCHAR(12),
    passport_series VARCHAR(4),
    passport_number VARCHAR(6),
    passport_issued_by TEXT,
    passport_issue_date DATE,
    passport_department_code VARCHAR(7),
    passport_registration_address TEXT,
    marital_status VARCHAR(20),
    marriage_date DATE,
    divorce_date DATE,
    phone_number VARCHAR(50),
    email_address VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы debtor_accounts (Счета должника)
CREATE TABLE debtor_accounts (
    id SERIAL PRIMARY KEY,
    debtor_id INTEGER NOT NULL REFERENCES debtors(id) ON DELETE CASCADE,
    account_type VARCHAR(50) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    bank_name VARCHAR(255),
    bank_bik VARCHAR(9),
    account_number VARCHAR(50),
    card_number VARCHAR(20),
    linked_phone VARCHAR(20),
    account_holder_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    currency VARCHAR(10) DEFAULT 'RUB',
    is_primary_for_purpose BOOLEAN DEFAULT FALSE,
    opened_date DATE,
    closed_date DATE,
    document_id INTEGER REFERENCES documents(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы creditors (Кредиторы)
CREATE TABLE creditors (
    id SERIAL PRIMARY KEY,
    case_id INTEGER NOT NULL REFERENCES bankruptcy_cases(id) ON DELETE CASCADE,
    creditor_type VARCHAR(20) NOT NULL,
    full_name VARCHAR(500) NOT NULL,
    inn VARCHAR(12),
    kpp VARCHAR(9),
    ogrn VARCHAR(15),
    legal_address TEXT,
    postal_address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'claimed',
    inclusion_date DATE,
    claim_basis TEXT,
    claim_origin_date DATE,
    claim_priority INTEGER,
    is_secured BOOLEAN DEFAULT FALSE,
    pledged_asset_description TEXT,
    total_claim_amount NUMERIC(20, 2),
    repayment_percentage NUMERIC(5, 2),
    repaid_amount NUMERIC(20, 2),
    bank_account_details TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы creditor_claims (Требования кредиторов)
CREATE TABLE creditor_claims (
    id SERIAL PRIMARY KEY,
    creditor_id INTEGER NOT NULL REFERENCES creditors(id) ON DELETE CASCADE,
    basis TEXT NOT NULL,
    amount NUMERIC(20, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'RUB',
    origin_date DATE,
    priority INTEGER,
    status VARCHAR(50) DEFAULT 'claimed',
    repayment_percent NUMERIC(5, 2),
    repaid_amount NUMERIC(20, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы pm_standards (Прожиточные минимумы)
CREATE TABLE pm_standards (
    id SERIAL PRIMARY KEY,
    region_code VARCHAR(20) NOT NULL,
    region_name VARCHAR(255) NOT NULL,
    social_group VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    effective_date DATE NOT NULL,
    type VARCHAR(20) NOT NULL,
    source VARCHAR(255),
    is_current BOOLEAN DEFAULT TRUE,
    last_api_sync TIMESTAMP,
    external_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для ускорения запросов
CREATE INDEX idx_document_attachments_source ON document_attachments(source_table, source_record_id);
CREATE INDEX idx_documents_case_id ON documents(case_id);
CREATE INDEX idx_documents_debtor_id ON documents(debtor_id);
CREATE INDEX idx_debtors_case_id ON debtors(case_id);
CREATE INDEX idx_creditors_case_id ON creditors(case_id);
CREATE INDEX idx_creditor_claims_creditor_id ON creditor_claims(creditor_id);
CREATE INDEX idx_pm_standards_region ON pm_standards(region_code, social_group, effective_date);