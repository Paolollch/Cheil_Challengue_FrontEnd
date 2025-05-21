import React, { useEffect, useState } from 'react';
import styles from './ProductoForm.module.css'; // Certifique-se que seu CSS está nesse arquivo

interface ProductoFormProps {
  onSubmit: (data: {
    Name: string;
    Image: File | null;
    Price: number;
    Stock: number;
    CategoryId: number;
  }) => void;
  categorias: { Id: string; Name: string }[];
  productoEditado?: {
    Name: string;
    Price: number;
    Stock: number;
    CategoryId: number;
  } | null;
}

const ProductoForm: React.FC<ProductoFormProps> = ({
  onSubmit,
  categorias,
  productoEditado = null,
}) => {
  const [nombre, setNombre] = useState(productoEditado?.Name || '');
  const [precio, setPrecio] = useState(productoEditado?.Price || 0);
  const [stock, setStock] = useState(productoEditado?.Stock || 0);
  const [categoria, setCategoria] = useState(productoEditado?.CategoryId || 0);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setNombre(productoEditado?.Name || '');
    setPrecio(productoEditado?.Price || 0);
    setStock(productoEditado?.Stock || 0);
    setCategoria(productoEditado?.CategoryId || 0);
    setImage(null);
    setError('');
  }, [productoEditado]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (nombre.trim() === '') {
      setError('El nombre es obligatorio');
      return;
    }

    if (isNaN(precio) || precio <= 0) {
      setError('El precio debe ser un número mayor a 0');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      setError('El stock debe ser un número mayor o igual a 0');
      return;
    }

    if (!categoria || categoria <= 0) {
      setError('Debe seleccionar una categoría');
      return;
    }

    if (!productoEditado && !image) {
      setError('Debe seleccionar una imagen');
      return;
    }

    setError('');
    onSubmit({
      Name: nombre,
      Image: image,
      Price: precio,
      Stock: stock,
      CategoryId: categoria,
    });

    if (!productoEditado) {
      setNombre('');
      setPrecio(0);
      setStock(0);
      setCategoria(0);
      setImage(null);
    }
  };

  const editando = !!productoEditado;

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2 className={styles.title}>{editando ? 'Editar' : 'Nuevo'} Producto</h2>

      <div className={styles.form}>
        <label className={styles.label}>Nombre *</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={styles.input}
        />

        <label className={styles.label}>Precio *</label>
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(parseFloat(e.target.value))}
          className={styles.input}
        />

        <label className={styles.label}>Stock *</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value))}
          className={styles.input}
        />

        <label className={styles.label}>Categoría *</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(Number(e.target.value))}
          className={styles.input}
        >
          <option value={0}>Seleccionar</option>
          {categorias.map((cat) => (
            <option key={cat.Id} value={Number(cat.Id)}>
              {cat.Name}
            </option>
          ))}
        </select>

        <label className={styles.label}>
          Imagen {editando ? '(Opcional)' : '*'}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setImage(e.target.files[0]);
            } else {
              setImage(null);
            }
          }}
          className={styles.input}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.button}>
            {editando ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductoForm;
