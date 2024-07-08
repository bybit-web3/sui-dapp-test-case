import { useSignPersonalMessage, useCurrentAccount } from '@mysten/dapp-kit';
import { Box, Card, Heading, TextField, Flex, Button , Text} from '@radix-ui/themes'
import { useCallback, useState } from 'react';
import { verifyPersonalMessageSignature } from '@mysten/sui/verify'

const SignMessage = () => {
    const { mutate: signPersonalMessage } = useSignPersonalMessage();
    const [message, setMessage] = useState('hello, Bybit!');
    const [pass, setPass] = useState(false);
    const [signature, setSignature] = useState('');
    const currentAccount = useCurrentAccount();

    const handleSignMessage = useCallback(async () => {
        signPersonalMessage(
            {
                message: new TextEncoder().encode(message),
            },
            {
                onSuccess: async (result: any) => {
                    setSignature(result.signature);
                    console.log('signature', result.signature);
                    console.log('result', result);
                    const publicKey = await verifyPersonalMessageSignature(new TextEncoder().encode(message), result.signature);
                    console.log('publicKey', publicKey);
                    if (publicKey.toSuiAddress() !== currentAccount?.address) {
                        setPass(true);
                        alert('signature verified');
                    }
                },
            },
        );
    }, [message, signPersonalMessage]);

    return (
        <Box>
            <Card style={pass ? {backgroundColor: 'var(--jade-8)' } : {}}>
                <Flex direction="column" gap="3" >
                    <Heading as="h2">Sign Message</Heading>
                    <TextField.Input size="2" placeholder="input message" value={message} onChange={(ev) => setMessage(ev.target.value)} />
                    <Text size="2">message: {message}</Text>
                    {signature && <Text size="2">Signature: {signature}</Text>}
                    <Button variant="solid" onClick={handleSignMessage}>Go</Button>
                </Flex>
            </Card>
        </Box>
    )
}

export default SignMessage