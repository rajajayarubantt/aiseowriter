import React, { useEffect, useState } from 'react';

/*Assets*/
import Icons from '../../assets/Icons'

import { Table } from 'antd';


const Index = ({ columns = [], data = [], maxHeight = 'max-content', has_select = true, pagination = false, loading = false, onChange = () => { } }) => {

    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    const [Columns, setColumns] = useState(columns)
    const [Data, setData] = useState(data)

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    useEffect(() => {
        setData(data)

    }, [data])

    return (
        <>
            <Table
                rowSelection={has_select ? rowSelection : undefined}
                columns={Columns}
                dataSource={data}
                sortDirections={['ascend', 'descend']}
                showSorterTooltip={true}
                pagination={pagination}
                loading={loading}
                onChange={onChange}
                style={{ maxHeight: maxHeight, overflowY: 'auto' }}

            />
        </>
    )

}

export default Index