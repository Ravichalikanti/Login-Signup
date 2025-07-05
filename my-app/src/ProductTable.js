import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, TextField, Box, Button, Typography, AppBar, Toolbar,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: 0, category: '', inStock: false });
  const [deleteId, setDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api/products';
  const token = JSON.parse(localStorage.getItem('auth'))?.token;
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL, { headers });
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('auth');
        navigate('/login');
      }
    }
  };

  const handleEditClick = (product) => {
    setEditId(product._id);
    setEditForm({
      name: product.name,
      price: product.price,
      category: product.category,
      inStock: product.inStock
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : 
              name === 'inStock' ? e.target.checked : value
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/${editId}`, editForm, { headers });
      fetchProducts();
      setEditId(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteId}`, { headers });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Product Management
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <TextField
          fullWidth
          label="Search Products"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>In Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      {editId === product._id ? (
                        <TextField
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          size="small"
                        />
                      ) : (
                        product.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editId === product._id ? (
                        <TextField
                          name="price"
                          type="number"
                          value={editForm.price}
                          onChange={handleEditChange}
                          size="small"
                        />
                      ) : (
                        `$${product.price.toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editId === product._id ? (
                        <TextField
                          name="category"
                          value={editForm.category}
                          onChange={handleEditChange}
                          size="small"
                        />
                      ) : (
                        product.category
                      )}
                    </TableCell>
                    <TableCell>
                      {editId === product._id ? (
                        <input
                          type="checkbox"
                          name="inStock"
                          checked={editForm.inStock}
                          onChange={handleEditChange}
                        />
                      ) : (
                        product.inStock ? 'Yes' : 'No'
                      )}
                    </TableCell>
                    <TableCell>
                      {editId === product._id ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSave}
                          sx={{ mr: 1 }}
                        >
                          Save
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEditClick(product)}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteClick(product._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5,10, 25]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductTable;