import { useEffect, useState } from 'react';
import { productoService } from '@/services/producto';
import { categoriaService } from '@/services/categoria';
import styles from './TableProduct.module.css';
import Modal from './Modal';
import ProductoForm from './ProductoForm';

interface Product {
  Id: number;
  Name: string;
  Price: number;
  Stock: number;
  Image: string;
  CategoryId: number;
}

export default function TablaProductos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [showProductoModal, setShowProductoModal] = useState(false);
  const [productoEditado, setProductoEditado] = useState<Product | null>(null);
  const [categorias, setCategorias] = useState<{ Id: string; Name: string }[]>([]);
  

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (page: number) => {
    try {
      const res = await productoService.getAll(page);
      setProducts(res.data);
      setLastPage(res.lastPage);
    } catch (error) {
      console.error('Error al cargar productos', error);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    await productoService.delete(id);
    fetchProducts(page);
  };

  const handleEditar = async (producto: Product) => {
    try {
      const categoriasData = await categoriaService.getAll();
      setCategorias(categoriasData);
      setProductoEditado(producto);
      setShowProductoModal(true);
    } catch (error) {
      console.error('Error al cargar categorías', error);
      alert('No se pudieron cargar las categorías');
    }
  };

  const handleGuardar = async (data: {
    Name: string;
    Image: File | null;
    Price: number;
    Stock: number;
    CategoryId: number;
  }) => {
    if (!productoEditado) return;

    try {
      const formData = new FormData();
      formData.append('Name', data.Name);
      if (data.Image) formData.append('Image', data.Image);
      formData.append('Price', data.Price.toString());
      formData.append('Stock', data.Stock.toString());
      formData.append('CategoryId', data.CategoryId.toString());

      await productoService.update(formData, productoEditado.Id);

      alert('Producto actualizado correctamente');
      setShowProductoModal(false);
      setProductoEditado(null);
      fetchProducts(page);
    } catch (error) {
      console.error('Error al actualizar producto', error);
      alert('Error al actualizar producto');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.Id}>
                <td>{product.Id}</td>
                <td>{product.Name}</td>
                <td>{product.Price}</td>
                <td>{product.Stock}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={`${styles.button} ${styles.outline}`}
                      onClick={() => window.open(product.Image, '_blank')}
                    >
                      Ver Foto
                    </button>
                    <button
                      className={`${styles.button} ${styles.outline}`}
                      onClick={() => handleEditar(product)}
                    >
                      Editar
                    </button>
                    <button
                      className={`${styles.button} ${styles.danger}`}
                      onClick={() => handleEliminar(product.Id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button
          className={styles.button}
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Anterior
        </button>
        <span>
          Página {page} de {lastPage}
        </span>
        <button
          className={styles.button}
          disabled={page >= lastPage}
          onClick={() => setPage(page + 1)}
        >
          Siguiente
        </button>
      </div>

      {showProductoModal && (
        <Modal
          isOpen={showProductoModal}
          onClose={() => {
            setShowProductoModal(false);
            setProductoEditado(null);
          }}
        >
          <ProductoForm
            categorias={categorias}
            productoEditado={productoEditado}
            onSubmit={handleGuardar}
          />
        </Modal>
      )}
    </div>
  );
}
