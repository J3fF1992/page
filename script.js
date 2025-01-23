// URL do backend
const BACKEND_URL = "https://253a-2804-1b3-a2c0-5add-ad45-1916-cd96-ae9b.ngrok-free.app";

// Função para renderizar o Payment Brick
const renderPaymentBrick = async (preferenceId) => {
    const mp = new MercadoPago('APP_USR-e933098e-751d-437a-8653-ceb11d01aaf3', { locale: 'pt-BR' });

    const bricksBuilder = mp.bricks();
    const settings = {
        initialization: {
            preferenceId: preferenceId, // Usa o preferenceId recebido do backend
        },
        customization: {
            paymentMethods: {
                creditCard: "all",
                debitCard: "all",
                ticket: "all",
            },
            visual: {
                style: {
                    theme: "default",
                },
            },
        },
        callbacks: {
            onReady: () => {
                console.log("Payment Brick carregado.");
            },
            onSubmit: (formData) => {
                return new Promise((resolve, reject) => {
                    fetch(`${BACKEND_URL}/process_payment`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.status === "success") {
                            alert("Pagamento realizado com sucesso!");
                            resolve();
                        } else {
                            alert("Erro no pagamento.");
                            reject(data);
                        }
                    })
                    .catch((error) => {
                        console.error("Erro na comunicação com o backend:", error);
                        reject(error);
                    });
                });
            },
            onError: (error) => {
                console.error("Erro no Payment Brick:", error);
            },
        },
    };

    await bricksBuilder.create("payment", "paymentBrick_container", settings);
};

// Função para buscar o preferenceId do backend
fetch(`${BACKEND_URL}/create_preference`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: 150.0 }) // Valor a ser pago
})
    .then((response) => response.json())
    .then((data) => {
        renderPaymentBrick(data.preferenceId); // Renderiza o Payment Brick com o preferenceId
    })
    .catch((error) => {
        console.error("Erro ao obter o preferenceId:", error);
    });
