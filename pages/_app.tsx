import "../styles/globals.css";
import "@interchain-ui/react/styles";

import type { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ChainProvider } from "@interchain-kit/react";
import { defaultChainName } from "../config/defaults";
import { assetLists, chains } from "@chain-registry/v2";
import { keplrWallet } from "@interchain-kit/keplr-extension";
import { leapWallet } from "@interchain-kit/leap-extension";
import {
  Box,
  ThemeProvider,
  Toaster,
  useTheme,
  useColorModeValue,
} from "@interchain-ui/react";
import { defaultRpcEndpoint } from "@/config";
import { QueryClientContext, QueryClientContextProviderContext } from "../components/SharingContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function CreateCosmosApp({ Component, pageProps }: AppProps) {
  const { themeClass } = useTheme();

  return (
    <ThemeProvider>
      <ChainProvider
        chains={chains.filter((chain) => chain.chainName === defaultChainName)}
        assetLists={assetLists.filter(
          (assetList) => assetList.chainName === defaultChainName
        )}
        wallets={[keplrWallet, leapWallet]}
        signerOptions={{
          signing: () => {
            return {
              broadcast: {
                checkTx: true,
                deliverTx: true,
              },
            };
          },
        }}
        endpointOptions={{
          endpoints: {
            "cosmoshub-4": {
              rpc: [defaultRpcEndpoint],
            },
          },
        }}
      >
        <QueryClientContextProviderContext queryClient={queryClient}>
          <QueryClientProvider client={queryClient} context={QueryClientContext}>
            <Box
              className={themeClass}
              minHeight="100dvh"
              backgroundColor={useColorModeValue("$white", "$background")}
            >
              {/* TODO fix type error */}
              {/* @ts-ignore */}
              <Component {...pageProps} />
            </Box>
          </QueryClientProvider>
        </QueryClientContextProviderContext>
      </ChainProvider>

      <Toaster position={"top-right"} closeButton={true} />
    </ThemeProvider>
  );
}

export default CreateCosmosApp;
