let dataTable;

const initDataTable = async () => {
    await listProducts();

    if (dataTable) {
        dataTable.destroy();
    }

    dataTable = $("#datatable_products").DataTable({
        dom: 'Bfrtip',
        buttons: ['copy', 'pdf', 'print']
    });

    $("#deleteSelectedBtn").on("click", deleteSelected);
    $("#calculateTotalBtn").on("click", calculateTotal);
};

const listProducts = async () => {
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        const products = await response.json();

        const content = products.map((product) => `
            <tr>
                <td><input type="checkbox" class="table-select"></td>
                <td>${product.id}</td>
                <td>${product.title}</td>
                <td>${product.price}</td>
                <td>${product.description}</td>
                <td>${product.category}</td>
                <td><a href="#" onclick="showImageAlert('${product.image}'); return false;">Ver imagen</a></td>
                <td>${product.rating.rate}</td>
                <td>${product.rating.count}</td>
            </tr>`
        ).join('');

        $("#tableBody_products").html(content);
    } catch (ex) {
        alert(ex);
    }
};

const showImageAlert = (imageUrl) => {
    Swal.fire({
        title: "Producto",
        imageUrl: imageUrl,
        imageAlt: "Imagen",
        imageWidth: 300,
        imageHeight: 300,
        showCloseButton: true,
        backdrop: `rgba(173, 216, 230, 0.4)`
    });
};

const deleteSelected = () => {
    const selectedRows = $("input.table-select:checked");

    if (selectedRows.length > 0) {
        Swal.fire({
            title: 'Eliminar Registros',
            text: '¿Está seguro de que desea eliminar los registros seleccionados?',
            icon: 'warning',
            showCancelButton: true,
            backdrop: `rgba(173, 216, 230, 0.4)`
        }).then((result) => {
            if (result.isConfirmed) {
                selectedRows.closest('tr').remove();
                Swal.fire({
                    title: 'Eliminados',
                    text: 'Registros eliminados correctamente',
                    icon: 'success',
                    backdrop: `rgba(173, 216, 230, 0.4)`
                });
            }
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'No hay registros seleccionados para eliminar',
            icon: 'error',
            backdrop: `rgba(173, 216, 230, 0.4)`
        });
    }
};

const calculateTotal = () => {
    const selectedRows = $("input.table-select:checked");
    let selectedPrices;

    if (selectedRows.length > 0) {
        selectedPrices = selectedRows.closest("tr").find("td:nth-child(4)").map((_, element) => parseFloat($(element).text())).get();
    } else {
        selectedPrices = $("td:nth-child(4)").map((_, element) => parseFloat($(element).text())).get();
    }

    const total = selectedPrices.reduce((acc, price) => acc + price, 0);

    Swal.fire({
        title: 'Suma Total.Seleciona los productos que quieras sumar',
        text: `La suma total de los productos seleccionados es: ${total.toFixed(2)}`,
        icon: 'info',
        backdrop: `rgba(173, 216, 230, 0.4)`
    });
};

window.addEventListener("load", async () => {
    await initDataTable();
});
