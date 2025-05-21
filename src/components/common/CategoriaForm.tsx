import React, { useEffect, useState } from 'react';
import { categoriaService } from '@/services/categoria';
import styles from './CategoriaForm.module.css';

interface Categoria {
  Id: string;
  Name: string;
  Description: string;
}

const CategoriaForm: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editando, setEditando] = useState<Categoria | null>(null);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const data = await categoriaService.getAll();
      setCategorias(data);
    } catch (err) {
      console.error('Error al cargar categorías', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nombre.trim() === '') {
      setError('El nombre es obligatorio');
      return;
    }

    setError('');

    try {
      if (editando) {
        await categoriaService.update(editando.Id, { Name: nombre, Description: descripcion });
      } else {
        await categoriaService.create({ Name: nombre, Description: descripcion });
      }

      setNombre('');
      setDescripcion('');
      setEditando(null);
      cargarCategorias();
    } catch (err) {
      console.error('Error al guardar categoría', err);
    }
  };

  const handleEditar = (cat: Categoria) => {
    setEditando(cat);
    setNombre(cat.Name);
    setDescripcion(cat.Description);
  };

  const handleEliminar = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await categoriaService.delete(id);
        cargarCategorias();
      } catch (err) {
        console.error('Error al eliminar categoría', err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>{editando ? 'Editar' : 'Nueva'} Categoría</h2>

        <div>
          <label className={styles.label} htmlFor="nombre">Nombre *</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={styles.input}
          />
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div>
          <label className={styles.label} htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className={styles.textarea}
            rows={3}
          />
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.button}>
            {editando ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>

      <hr className={styles.divider} />

      <h3 className={styles.subTitle}>Categorías existentes</h3>
      <ul className={styles.list}>
        {categorias.map((cat) => (
          <li key={cat.Id} className={styles.listItem}>
            <div className={styles.itemInfo}>
              <p className={styles.itemName}>{cat.Name}</p>
              <p className={styles.itemDesc}>{cat.Description}</p>
            </div>
            <div className={styles.actions}>
              <button
                onClick={() => handleEditar(cat)}
                className={`${styles.actionButton} ${styles.edit}`}
                type="button"
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminar(cat.Id)}
                className={`${styles.actionButton} ${styles.delete}`}
                type="button"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriaForm;
