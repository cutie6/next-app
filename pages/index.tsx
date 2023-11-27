import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';


const randomUserApi ='https://randomuser.me/api/'
const fetchRandomUser = async () => {
  const res = await axios.get(randomUserApi);
  return res.data.results?.[0]
}

async function getRandomUsers(num:number){
  const data=[]
  for(let i=0;i<num;i++){
    data[i] = await fetchRandomUser()
    data[i].key=i
  }
  return data
}

const randomUserObj  = {
  "gender": "female",
  "name": {
    "title": "Miss",
    "first": "Jennie",
    "last": "Nichols"
  },
  "location": {
    "street": {
      "number": 8929,
      "name": "Valwood Pkwy",
    },
    "city": "Billings",
    "state": "Michigan",
    "country": "United States",
    "postcode": "63104",
    "coordinates": {
      "latitude": "-69.8246",
      "longitude": "134.8719"
    },
    "timezone": {
      "offset": "+9:30",
      "description": "Adelaide, Darwin"
    }
  },
  "email": "jennie.nichols@example.com",
  "login": {
    "uuid": "7a0eed16-9430-4d68-901f-c0d4c1c3bf00",
    "username": "yellowpeacock117",
    "password": "addison",
    "salt": "sld1yGtd",
    "md5": "ab54ac4c0be9480ae8fa5e9e2a5196a3",
    "sha1": "edcf2ce613cbdea349133c52dc2f3b83168dc51b",
    "sha256": "48df5229235ada28389b91e60a935e4f9b73eb4bdb855ef9258a1751f10bdc5d"
  },
  "dob": {
    "date": "1992-03-08T15:13:16.688Z",
    "age": 30
  },
  "registered": {
    "date": "2007-07-09T05:51:59.390Z",
    "age": 14
  },
  "phone": "(272) 790-0888",
  "cell": "(489) 330-2385",
  "id": {
    "name": "SSN",
    "value": "405-88-3636"
  },
  "picture": {
    "large": "https://randomuser.me/api/portraits/men/75.jpg",
    "medium": "https://randomuser.me/api/portraits/med/men/75.jpg",
    "thumbnail": "https://randomuser.me/api/portraits/thumb/men/75.jpg"
  },
  "nat": "US"
}

type DataType = typeof randomUserObj & {key:number}



const detailConfig=[
  {
    label:'Email',
    getText:(record:DataType)=>record.email
  },
  {
    label: 'Phone',
    getText: (record: DataType) => record.phone
  },
  {
    label: 'Registered Date',
    getText: (record: DataType) => record.registered.date.slice(0,10)
  },
  {
    label: 'Cell',
    getText: (record: DataType) => record.cell
  },
  {
    label: 'Birthday',
    getText: (record: DataType) => record.dob.date.slice(0, 10)
  },
]


export default function Home() {
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([])


  const columns: ColumnsType<DataType> = useMemo(()=>{
    return [
      {
        title: 'Name', dataIndex: '', key: 'name',
        render: (text, record, index) => {

          const isExpanded = expandedRowKeys[0]===index

          const size = isExpanded?'60px':'40px'
          const url = isExpanded ? record.picture.medium : record.picture.thumbnail
          return <div style={{
            display: 'flex',
            alignItems:'center'
          }}>
            <div style={{
              height: size,
              width: size,
              borderRadius: '50%',
              backgroundSize: 'cover',
              backgroundImage: `url(${url})`,
              marginRight: '10px'
            }}></div>
            <div>
              <p>{record.name.first} {record.name.last}</p>
              {/* 现在数据里没有返回 name.user 了 */}
              <p style={{
                color: '#666'
              }}>{record.name.title}</p>
            </div>
          </div>
        },
      },
      {
        title: 'Phone', key: 'phone',
        render: (text, record) => <span style={{
          color: '#666'
        }}>
          {record.phone}
        </span>,
      },
      {
        title: 'Location', dataIndex: '', key: 'location',
        render: (text, record) => <span style={{
          display: 'inline-block',
          padding: '2px 14px',
          borderRadius: '28px',
          background: '#fcf0dd',
          color: '#913f1d'
        }}>
          {record.location.city}, {record.location.country}
        </span>,
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: () => <a>Delete</a>,
      },
    ]

  },[expandedRowKeys])

 

  const [data, setData] = useState<DataType[]>([])

  useEffect(()=>{
    getRandomUsers(5).then((res: DataType[]) =>{
      setData(res)
    })
  },[])

  const handleOnExpand = useCallback((flag: Boolean, record: DataType)=>{
    if(flag){
      setExpandedRowKeys([record.key])
    }else{
      setExpandedRowKeys([])
    }

  },[])

  return (
   <div>
    <div  style={{
      height:'100px',
      background:'yellowgreen'
    }}></div>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: (record) => <div style={{
            display:'grid',
            gridTemplateColumns: '50% 50%',
            marginLeft:'60px'
          }}>
            {
              detailConfig.map((ele,ind)=>{
              return  <div key={ind} style={{marginBottom:'15px'}}>
                  <p style={{color:'#666'}}>{ele.label}</p>
                  <p>{ele.getText(record)}</p>
                </div>
              })
            }

          </div>,
          rowExpandable: (record) => true,
          expandRowByClick:true,
          showExpandColumn:false,
          expandedRowKeys,
          onExpand: handleOnExpand
        }}
        dataSource={data}
        sticky={true}
      />
   </div>
  )
}
