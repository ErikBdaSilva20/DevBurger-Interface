import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '../../../services/api.js';

import { useLocation, useNavigate } from 'react-router-dom';

import * as yup from 'yup';
import { Image } from '@phosphor-icons/react';
import {
  Container,
  Form,
  InputGroup,
  Input,
  InputLabel,
  Label,
  LabelUpload,
  Select,
  SubmitButton,
  ErrorMessage,
  OfferCheckBox
} from './styles.js';
import { toast } from 'react-toastify';

const schema = yup.object({
  name: yup.string().required('Escolha um nome válido'),
  price: yup
    .number()
    .positive()
    .required('Digite o valor do produto')
    .typeError('Digite o valor do produto'),
  category: yup.object().required('Escolha uma categoria para o produto'),
  offer: yup.bool()
});

export function EditProduct() {
  const [fileName, setFileName] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const {
    state: { product }
  } = useLocation();

  useEffect(() => {
    async function loadCategories() {
      const { data } = await api.get('/categories');

      setCategories(data);
    }

    loadCategories();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data) => {
    const productFormData = new FormData();

    productFormData.append('name', data.name);
    productFormData.append('price', data.price * 100);
    productFormData.append('category_id', data.category.id);
    productFormData.append('file', data.file[0]);
    productFormData.append('offer', data.offer);

    try {
      await toast.promise(api.put(`/products/${product.id}`, productFormData), {
        pending: 'Um momento, editando produto',
        success: 'Produto editado com sucesso',
        error: '🥶 Erro ao editar o produto! Tente novamente'
      });
    } catch (err) {}

    setTimeout(() => {
      navigate('/admin/produtos');
    }, 2000);
  };
  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <InputLabel>Nome</InputLabel>
          <Input
            type="text"
            {...register('name')}
            defaultValue={product.name}
          />
          <ErrorMessage>{errors?.name?.message}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <InputLabel>Preço</InputLabel>
          <Input
            type="number"
            {...register('price')}
            defaultValue={product.price / 100}
          />
          <ErrorMessage>{errors?.price?.message}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <LabelUpload>
            <Image />
            <input
              type="file"
              {...register('file')}
              accept="image/png, image/jpeg"
              onChange={(imageFile) => {
                setFileName(imageFile.target.files[0]?.name);
                register('file').onChange(imageFile);
              }}
            />
            {fileName || 'Nenhum arquivo selecionado'}
          </LabelUpload>
          <ErrorMessage>{errors?.file?.message}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <Label>Categoria</Label>
          <Controller
            name="category"
            control={control}
            defaultValue={product.category}
            render={({ field }) => (
              <Select
                {...field}
                options={categories}
                getOptionLabel={(category) => category.name}
                getOptionValue={(category) => category.id}
                menuPortalTarget={document.body}
                placeholder="Categorias"
                defaultValue={product.category}
              />
            )}
          />
          <ErrorMessage>{errors?.category?.message}</ErrorMessage>
        </InputGroup>
        <SubmitButton type="submit">Editar Produto</SubmitButton>

        <InputGroup>
          <OfferCheckBox>
            <input
              type="checkbox"
              defaultChecked={product.offer}
              {...register('offer')}
            />
            <Label>Produto em oferta?</Label>
          </OfferCheckBox>
        </InputGroup>
      </Form>
    </Container>
  );
}
