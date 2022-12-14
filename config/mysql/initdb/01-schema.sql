create table term (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    term VARCHAR(1024) NOT NULL UNIQUE,
    search_count INT UNSIGNED NOT NULL DEFAULT 1,
    last_search_tstamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

create table definition (
   id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
   term_id INT UNSIGNED NOT NULL,
   text TEXT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY definition__term(term_id) REFERENCES term(id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;