import React, { useEffect, useState } from 'react';
import Modal from '../components/common/Modal';
import CategoriaForm from '../components/common/CategoriaForm';
import ProductoForm from '../components/common/ProductoForm';
import { categoriaService } from '@/services/categoria';
import { productoService } from '@/services/producto';
import TablaProductos from '@/components/common/TableProduct';
import styles from './formulario.module.css';


export default function Formulario() {
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [categorias, setCategorias] = useState<{ Id: string; Name: string }[]>([]);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const data = await categoriaService.getAll();
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleCrearProducto = async (data: {
    Name: string;
    Image: File | null;
    Price: number;
    CategoryId: number;
    Stock: number
  }) => {
    try {
      if (!data.Image) {
        alert('Debe seleccionar una imagen');
        return;
      }

      const formData = new FormData();
      formData.append('Name', data.Name);
      formData.append('Image', data.Image);
      formData.append('Price', data.Price.toString());
      formData.append('Stock', data.Stock.toString());
      formData.append('CategoryId', data.CategoryId.toString());
      await productoService.create(formData);

      alert('Producto creado correctamente');
      setShowProductoModal(false);
    } catch (error) {
      console.error('Error al crear producto:', error);
      alert('Hubo un error al crear el producto');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Gestión de Inventario</h1>

      <div className={styles.botones}>
        <button
          className={`${styles.boton} ${styles.botonCategoria}`}
          onClick={() => setShowCategoriaModal(true)}
        >
          Agregar Categoría
        </button>
        <button
          className={`${styles.boton} ${styles.botonProducto}`}
          onClick={() => setShowProductoModal(true)}
        >
          Agregar Producto
        </button>
      </div>
      <TablaProductos/>

      {showCategoriaModal && (
        <Modal
          isOpen={showCategoriaModal}
          onClose={() => {
            setShowCategoriaModal(false);
            cargarCategorias();
          }}
        >
          <CategoriaForm />
        </Modal>
      )}

      {showProductoModal && (
        <Modal isOpen={showProductoModal} onClose={() => setShowProductoModal(false)}>
          <ProductoForm categorias={categorias} onSubmit={handleCrearProducto} />
        </Modal>
      )}
    </div>
  );
}
