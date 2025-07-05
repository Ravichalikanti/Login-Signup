import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination, TextField, Box
} from '@mui/material';
import axios from 'axios';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    axios.get('http://192.168.29.159:5000/api/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data); // initially show all
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
    setPage(0); // reset to first page on search
  }, [searchQuery, products]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: '90%', margin: 'auto', marginTop: 4, padding: 2 }}>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Search Products by Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>In Stock</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading && filteredProducts.length > 0 && (
              filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.inStock ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ProductTable;
