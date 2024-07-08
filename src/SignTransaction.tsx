import {
	ConnectButton,
	useCurrentAccount,
	useSignTransaction,
	useSuiClient,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Box, Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { useCallback, useState } from 'react';

const SignTransaction = () => {
    const { mutateAsync: signTransaction } = useSignTransaction();
	const [signature, setSignature] = useState('');
	const client = useSuiClient();
    const [pass, setPass] = useState(false);
	const currentAccount = useCurrentAccount();

    const handleSignTransaction = useCallback(async () => {
        // build transaction
        const tx = new Transaction();
        const [coin] = tx.splitCoins(tx.gas, [100]);
        // transfer the split coin to a specific address
        tx.transferObjects([coin], '0xad29c2d89d5a1a52806900d3a7b8bb7da8458fea2bb0e6e549aea9fb72711e74');

        const { bytes, signature } = await signTransaction({
            transaction: tx,
        });

        console.log({
            bytes, signature
        })

        setSignature(signature);

        // const executeResult = await client.executeTransactionBlock({
        //     transactionBlock: bytes,
        //     signature,
        //     options: {
        //         showRawEffects: true,
        //     },
        // });

        // console.log(executeResult);
        setPass(true);
    }, [signTransaction, client]);

	return (
        <Box>
        <Card style={pass ? {backgroundColor: 'var(--jade-8)' } : {}}>
            <Flex direction="column" gap="3" >
                <Heading as="h2">Sign Transaction</Heading>
                {/* <TextField.Input size="2" placeholder="input message" value={message} onChange={(ev) => setMessage(ev.target.value)} />
                <Text size="2">message: {message}</Text> */}
                {signature && <Text size="2">Signature: {signature}</Text>}
                <Button variant="solid" onClick={handleSignTransaction}>Go</Button>
            </Flex>
        </Card>
    </Box>
	);
}

export default SignTransaction