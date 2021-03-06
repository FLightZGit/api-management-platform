import React, { useState, useEffect, useRef } from 'react'
import project_requests from '../../service/projectService'
import { useNavigate, useSearchParams} from 'react-router-dom'

import { Card, Table, Button, Popconfirm, message,Input, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
const { Search } = Input;

function ProjectList() {

  const navigate = useNavigate() 
  //const username = params.get('username')
  const username = localStorage.getItem('username')
  const [projects, setProjects] = useState([]);
  let count = 0;
  
  useEffect(() => {
      console.log(username)
      project_requests.getProjectByUserName(username).then(res => { setProjects(res);count = res.length})
      
      //project_requests.getProjects().then(res => { setProjects(res) })
  }, [])

  console.log('TCL: projectList -> projects', projects)
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });
  const columns = [
    {
      title: '????????????',
      dataIndex: 'projectName',
      key: 'projectName',
      ...getColumnSearchProps('projectName')
    },
    {
      title: '??????????????????',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '???????????????',
      dataIndex: 'projectCreator',
      key: 'projectCreator',
    },
    {
      title: '????????????',
      dataIndex: 'projectNote',
      key: 'projectNote',
    },
    {
      title: '??????',
      key: 'action',
      render: (record) => {
        return (
          <>
            <Button type="primary" style={{ margin: '0 0.2rem' }} onClick={() => { navigate(`/menu/project/${record._id}/apisList`) }}>??????</Button>
            <Button style={{ margin: '0 0.5rem' }} onClick={() => { navigate(`/menu/project/${record._id}?username=`+username) }}>??????</Button>
            <Popconfirm
              title="?????????????"
              onConfirm={() => {
                console.log(record._id);
                //project_requests.deleteProject(record._id).then(res => { setProjects(res) })
                project_requests.deleteProject(record._id)
                message.success('?????????')
                window.location.reload()
              }}
              onCancel={(e) => {
                console.log(e)
              }}
              okText="??????"
              cancelText="??????"
            >
              <Button danger>??????</Button>
            </Popconfirm>
          </>
        )
      },
    },
  ]
  return (
    <Card title="????????????" extra={ <>
      <Button type="primary" onClick={() => { navigate('/menu/project?username=' + username) }}>??????</Button>
      
     </>
    } 
      style={{ width: '100%' }}>
      {/*<Search placeholder="???????????????" enterButton="??????" style={{ width: '30%'}} size="large" 
      onChange={(e)=>{
        projectName=e.target.value
      }} 
      onSearch={() =>{
        if(!projectName){
          window.location.reload()
        } else {
          project_requests.getProjectByProjectName({projectname:projectName}).then(
          res => {
            console.log(projectName)
            setProjects(res.projects)
          }
        )
        }
        
      }}/>*/}
      <Table columns={columns} dataSource={projects} rowKey={record => record._id} pagination={{total:count,pageSize:5}}/>
    </Card>
  )
}

export default ProjectList