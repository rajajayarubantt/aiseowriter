const Utils = require("./utils");

module.exports = {

    queryGeneratore: ({ METHOD, TABEL, DATA = undefined, SELECT = '*', VALID = undefined, LIMIT = undefined, PAGE = undefined }) => {

        /* 
            METHOD -> String
            TABEL -> String
            DATA -> String || Object || Array || Number
            SELECT -> String || Array
            VALID ->Object
        */

        METHOD = METHOD.toLocaleUpperCase()

        let QUERY = ''

        if (METHOD == 'INSERT') {

            QUERY += `${METHOD} INTO ${TABEL}(`

            let FIELDS = '';
            let VALUES = '';

            for (const key in DATA) {

                const VALUE = DATA[key];

                FIELDS += `${key}, `

                if (key == "location_coords" && (Array.isArray(VALUE) || Utils.isObject(VALUE))) VALUES += `${VALUE}, `
                else if (Array.isArray(VALUE) || Utils.isObject(VALUE)) VALUES += `${JSON.stringify(VALUE)}, `
                else VALUES += `'${VALUE}', `
            }

            FIELDS = FIELDS.trim()
            VALUES = VALUES.trim()

            FIELDS = FIELDS.slice(0, FIELDS.length - 1)
            VALUES = VALUES.slice(0, VALUES.length - 1)

            QUERY += FIELDS + ') VALUES(' + VALUES + ');'

            return QUERY
        }
        else if (METHOD == 'INSERT_MULTI') {

            QUERY += `INSERT INTO ${TABEL}(`

            let FIELDS = [];
            let VALUES = '';

            if (!Array.isArray(DATA)) return ""
            for (const key in DATA[0]) FIELDS.push(`${key}`)

            let multi_values = DATA.map((data, i) => {

                let VALUE = [];

                for (const key in data) VALUE.push(`'${data[key]}'`)

                return `(${VALUE.join(', ')})`

            })

            VALUES = multi_values.join(', ')

            FIELDS = FIELDS.join(', ')
            VALUES = VALUES.trim()

            QUERY += FIELDS + ') VALUES ' + VALUES + ';'

            return QUERY
        }
        else if (METHOD == 'SELECT') {


            SELECT = Array.isArray(SELECT) ? SELECT.join(', ') : SELECT

            if (!Object.keys(VALID).length) QUERY += `${METHOD} ${SELECT} FROM ${TABEL}`
            else {
                let VALID_FIELS = [];

                for (const key in VALID) {

                    const VALUE = VALID[key];

                    if (Utils.isObject(VALUE)) {

                    }

                    VALID_FIELS.push(`${key}='${VALUE}'`)

                }
                QUERY += `${METHOD} ${SELECT} FROM ${TABEL} WHERE ${VALID_FIELS.join(' AND ')}`
            }

            if (LIMIT != undefined || PAGE != undefined) {
                let OFFSET = PAGE * LIMIT;

                if (OFFSET > 0) QUERY += ` LIMIT ${LIMIT} OFFSET ${OFFSET};`
                else QUERY += ` LIMIT ${LIMIT};`
            }
        }
        else if (METHOD == 'UPDATE') {

            let VALUES = [];

            for (const key in DATA) {

                const VALUE = DATA[key];

                if (Array.isArray(VALUE) || Utils.isObject(VALUE)) VALUES.push(`${key}=${JSON.stringify(VALUE)}`)

                else VALUES.push(`${key}='${VALUE}'`)
            }

            let VALUE_FIELDS = VALUES.join(', ')

            if (!VALID) QUERY += `${METHOD} ${TABEL} SET ${VALUE_FIELDS};`

            else {
                let VALID_FIELS = [];

                for (const key in VALID) {

                    const VALUE = VALID[key];

                    VALID_FIELS.push(`${key}='${VALUE}'`)
                }
                QUERY += `${METHOD} ${TABEL} SET ${VALUE_FIELDS} WHERE ${VALID_FIELS.join(' AND ')};`
            }

        }
        else if (METHOD == 'DELETE') {

            if (!VALID) return

            let VALID_FIELS = [];

            for (const key in VALID) {

                const VALUE = VALID[key];

                VALID_FIELS.push(`${key}='${VALUE}'`)
            }
            QUERY += `${METHOD} FROM ${TABEL} WHERE ${VALID_FIELS.join(' AND ')};`
        }
        else if (METHOD == 'SHOW') {
            QUERY = `SHOW TABLES LIKE '${TABEL};`
        }

        return QUERY
    },
    prepareQueryGeneratore: ({ METHOD, TABEL, DATA = undefined, SELECT = '*', VALID = undefined, LIMIT = undefined, PAGE = undefined }) => {

        /* 
            METHOD -> String
            TABEL -> String
            DATA -> String || Object || Array || Number
            SELECT -> String || Array
            VALID ->Object
        */

        METHOD = METHOD.toLocaleUpperCase()

        let QUERY = ''
        let PREPARE_VALUE = []

        if (METHOD == 'INSERT') {

            QUERY += `${METHOD} INTO ${TABEL}(`

            let FIELDS = '';
            let VALUES = '';

            for (const key in DATA) {

                const VALUE = DATA[key];

                FIELDS += `${key}, `

                if (key.includes('location') && Array.isArray(VALUE)) {

                    PREPARE_VALUE.push(`POINT(${VALUE[0]} ${VALUE[1]})`)

                    VALUES += `ST_GeomFromText(?), `

                } else {
                    PREPARE_VALUE.push(VALUE)

                    VALUES += `?, `
                }


            }

            FIELDS = FIELDS.trim()
            VALUES = VALUES.trim()

            FIELDS = FIELDS.slice(0, FIELDS.length - 1)
            VALUES = VALUES.slice(0, VALUES.length - 1)

            QUERY += FIELDS + ') VALUES(' + VALUES + ');'

            return { query: QUERY, value: PREPARE_VALUE }
        }
        else if (METHOD == 'INSERT_MULTI') {

            QUERY += `INSERT INTO ${TABEL}(`

            let FIELDS = [];
            let VALUES = '';

            if (!Array.isArray(DATA)) return ""
            for (const key in DATA[0]) FIELDS.push(`${key}`)

            let multi_values = DATA.map((data, i) => {

                let VALUE = [];

                for (const key in data) {

                    let value = data[key]

                    if (Array.isArray(value)) PREPARE_VALUE.push(JSON.stringify(value))
                    else PREPARE_VALUE.push(data[key])

                    VALUE.push(`?`)
                }

                return `(${VALUE.join(', ')})`

            })

            VALUES = multi_values.join(', ')

            FIELDS = FIELDS.join(', ')
            VALUES = VALUES.trim()

            QUERY += FIELDS + ') VALUES ' + VALUES + ';'

            return { query: QUERY, value: PREPARE_VALUE }
        }
        else if (METHOD == 'SELECT') {


            SELECT = Array.isArray(SELECT) ? SELECT.join(', ') : SELECT

            if (!VALID || !Object.keys(VALID).length) QUERY += `${METHOD} ${SELECT} FROM ${TABEL}`
            else {
                let VALID_FIELS = [];

                for (const key in VALID) {

                    const VALUE = VALID[key];

                    PREPARE_VALUE.push(VALUE)

                    VALID_FIELS.push(`${key}=?`)

                }
                QUERY += `${METHOD} ${SELECT} FROM ${TABEL} WHERE ${VALID_FIELS.join(' AND ')}`
            }

            if (LIMIT != undefined || PAGE != undefined) {
                let OFFSET = (PAGE || 0) * LIMIT;

                if (OFFSET > 0) {
                    QUERY += ` LIMIT ? OFFSET ?;`
                    PREPARE_VALUE.push((LIMIT || 25), (PAGE || 0))
                }
                else {
                    QUERY += ` LIMIT ?;`
                    PREPARE_VALUE.push((LIMIT || 25))
                }

            }

            return { query: QUERY, value: PREPARE_VALUE }
        }
        else if (METHOD == 'UPDATE') {

            let VALUES = [];

            for (const key in DATA) {

                let VALUE = DATA[key];

                if (key.includes('location') && Array.isArray(VALUE)) {

                    PREPARE_VALUE.push(`POINT(${VALUE[0]} ${VALUE[1]})`)

                    VALUES.push(`${key}=ST_GeomFromText(?)`)

                } else {
                    VALUES.push(`${key}=?`)

                    if (Array.isArray(VALUE)) PREPARE_VALUE.push(`${JSON.stringify(VALUE)}`)

                    else PREPARE_VALUE.push(VALUE)
                }
            }

            let VALUE_FIELDS = VALUES.join(', ')

            if (!VALID) QUERY += `${METHOD} ${TABEL} SET ${VALUE_FIELDS};`

            else {
                let VALID_FIELS = [];

                for (const key in VALID) {

                    const VALUE = VALID[key];

                    VALID_FIELS.push(`${key}=?`)
                    PREPARE_VALUE.push(VALUE)

                }
                QUERY += `${METHOD} ${TABEL} SET ${VALUE_FIELDS} WHERE ${VALID_FIELS.join(' AND ')};`
            }

            return { query: QUERY, value: PREPARE_VALUE }
        }
        else if (METHOD == 'DELETE') {

            if (!VALID) return

            let VALID_FIELS = [];

            for (const key in VALID) {

                const VALUE = VALID[key];

                VALID_FIELS.push(`${key}=?`)
                PREPARE_VALUE.push(VALUE)

            }
            QUERY += `${METHOD} FROM ${TABEL} WHERE ${VALID_FIELS.join(' AND ')};`

            return { query: QUERY, value: PREPARE_VALUE }
        }
        else if (METHOD == 'SHOW') {
            QUERY = `SHOW TABLES LIKE '${TABEL};`

            return { query: QUERY, value: [] }
        }
    },
}