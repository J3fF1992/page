const mp = new MercadoPago('APP_USR-e933098e-751d-437a-8653-ceb11d01aaf3', { locale: 'pt-BR' }); // Substitua YOUR_PUBLIC_KEY pela sua chave pública do Mercado Pago

const bricksBuilder = mp.bricks();

const renderPaymentBrick = async () => {
    const settings = {
        initialization: {
            amount: 100, // Valor do pagamento em reais (ajuste conforme necessário)
            preferenceId: "12282333-4865669b-8baa-4963-ab3b-6ebc41c6aa0d", // Substitua pelo ID da preferência gerada no backend
        },
        customization: {
            paymentMethods: {
                creditCard: "all",
                debitCard: "all",
                ticket: "all",
            },
            visual: {
                style: {
                    theme: "default", // Altere para 'dark' ou outros temas se necessário
                },
            },
        },
        callbacks: {
            onReady: () => {
                console.log("Brick pronto!");
            },
            onSubmit: (formData) => {
                return new Promise((resolve, reject) => {
                    fetch('/process_payment', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        alert("Pagamento processado com sucesso!");
                        resolve();
                    })
                    .catch((error) => {
                        alert("Erro ao processar o pagamento.");
                        console.error(error);
                        reject();
                    });
                });
            },
            onError: (error) => {
                console.error("Erro no Brick:", error);
            },
        },
    };

    await bricksBuilder.create("payment", "paymentBrick_container", settings);
};

renderPaymentBrick();
