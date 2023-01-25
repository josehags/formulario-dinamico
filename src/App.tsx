import { Button, Divider, Form, Input, Select, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from "axios";
import {  useEffect, useState } from "react";
import Search from 'antd/es/input/Search';

type IBGEUFResponse = {
  sigla: string;
  nome: string;
};
type IBGECITYResponse = {
  id: number;
  nome: string;
};

const App = () => {
  const [ufs, setUfs] = useState<IBGEUFResponse[]>([]);
  const [cities, setCities] = useState<IBGECITYResponse[]>([]);
  
  const [form] = Form.useForm();

  const [selectUf, setselectUf] = useState('0');
  const [selectCity, setselectCity] = useState('0');



  const searchCep = (value: string) => {
      fetch(`https://viacep.com.br/ws/${value}/json/`)
        .then(res => res.json())
        .then(data => {
          console.log('consulta API', data);
          form.setFieldsValue({
            logradouro: data.logradouro,
            bairro: data.bairro,
        });
      });
    };

  useEffect(() => {
    if (selectUf === '0') {
      return;
    }
    axios
      .get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectUf}/municipios`
      )
      .then((response) => {
        setCities(response.data);
      });
  });

  useEffect(() => {
    axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/")
      .then((response) => {
        setUfs(response.data);
      });
  }, [selectUf]);

  function handleSelectUf(value: string) {
    console.log(value);
    setselectUf(value);
  }

  function handleSelectCity(value: string) {
    console.log(value);
    setselectCity(value);
  }



  return (
    
      <Form form={form}>
        <Divider>Endereços</Divider>
        <Form.List name={'adress'}>
          {(fields, { add, remove }) => (
            <>
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Adicionar endereço
                </Button>
              </Form.Item>

              {fields.map(({ key, name }) => (
                <Input.Group>
                 <Space key={key} align="baseline">
                    <Form.Item label="CEP" name={[name, 'cep']}>
                      <Search onSearch={searchCep} />
                    </Form.Item>

                    <Form.Item label="Rua">
                      <Input
                        value={form.getFieldsValue(true).logradouro}
                        readOnly
                      />
                    </Form.Item>
                    <Form.Item label="Bairro">
                      <Input
                        value={form.getFieldsValue(true).bairro}
                        readOnly
                      />
                    </Form.Item>

                    <Form.Item label="Estado" name={[name, 'estado']}>
                      <Select
                        showSearch
                        placeholder="Selecione a UF"
                        onChange={handleSelectUf}
                        value={selectUf}
                        filterOption={(input, option) =>
                          (option?.label ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={ufs.map(uf => ({
                          label: uf.nome,
                          value: uf.sigla,
                        }))}
                      />
                    </Form.Item>
                    <Form.Item label="Cidade" name={[name, 'cidade']}>
                      <Select
                        showSearch
                        placeholder="Selecione a cidade"
                        onChange={handleSelectCity}
                        value={selectCity}
                        filterOption={(input, option) =>
                          (option?.label ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={cities.map(city => ({
                          key: city.id,
                          label: city.nome,
                          value: city.nome,
                        }))}
                      />
                    </Form.Item>
                    <DeleteOutlined
                      style={{ color: 'red' }}
                      onClick={() => remove(name)}
                    />
                  </Space>
                </Input.Group>
              ))}
            </>
          )}
        </Form.List>
      </Form>
    )
}
export default App;
