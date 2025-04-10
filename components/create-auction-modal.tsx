"use client"

import * as React from "react";
import { ethers, parseEther } from "ethers"
import { Form } from "@heroui/form"
import { Input, Textarea } from "@heroui/input"
import toast from "react-hot-toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/modal"
import { Button } from "@heroui/button"
import { Plus } from "lucide-react"

import { getContract, getProvider } from "@/contract/contract"

interface CreateAuctionModalProps {
  trigger?: React.ReactNode
}

interface AuctionForm {
  name: string
  description: string
  duration: string
  startingBid: string
}

const connectWallet = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    toast.error("No wallet found. Please install MetaMask.");
    throw new Error("No wallet");
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  if (!accounts || accounts.length === 0) {
    toast.error("Please connect your wallet.");
    throw new Error("Wallet not connected");
  }

  return accounts[0];
};

const checkNetwork = async () => {
  const provider = getProvider();
  const network = await provider.getNetwork();
  const chainId = network.chainId;

  if (chainId !== BigInt(656476)) {
    toast.error("Please switch your wallet to the correct network.");
    throw new Error("Wrong network");
  }
};

export default function CreateAuctionModal({ trigger }: CreateAuctionModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [formData, setFormData] = React.useState<AuctionForm>({
    name: "",
    description: "",
    duration: "",
    startingBid: "",
  })

  const [submitted, setSubmitted] = React.useState<AuctionForm | null>(null)
  const [errors, setErrors] = React.useState<Partial<AuctionForm>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<AuctionForm> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.duration || isNaN(Number(formData.duration)) || Number(formData.duration) <= 0)
      newErrors.duration = "Valid duration is required"
    if (!formData.startingBid || isNaN(Number(formData.startingBid)) || Number(formData.startingBid) <= 0)
      newErrors.startingBid = "Valid starting bid is required"

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  return (
    <>
      {trigger ?? (
        <Button className="mt-4 md:mt-0" onPress={onOpen}>
          <Plus className="h-4 w-4" />
          Create Auction
        </Button>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => {
            const handleSubmit = async (e?: React.FormEvent) => {
              e?.preventDefault();
              if (!validateForm()) return;

              try {
                setIsSubmitting(true);
                await connectWallet();
                await checkNetwork();

                const contract = await getContract();

                const { name, description, duration, startingBid } = formData;

                const durationInSeconds = parseInt(duration) * 60;
                const startingBidWei = parseEther(startingBid);

                const tx = await contract.createAuction(
                  name,
                  description,
                  durationInSeconds,
                  startingBidWei
                );

                const receipt = await tx.wait();

                if (receipt.status === 1) {
                  toast.success("Auction successfully created!");
                  setSubmitted(formData);
                  setFormData({ name: "", description: "", duration: "", startingBid: "" });
                  onClose();

                  setTimeout(() => {
                    window.location.reload();
                  }, 500);
                } else {
                  toast.error("Auction creation failed.");
                  throw new Error("Transaction failed");
                }
              } catch (err) {
                console.error("Auction creation failed:", err);
                toast.error("Auction creation failed.");
              } finally {
                setIsSubmitting(false);
              }
            };

            return (
              <>
                <ModalHeader className="flex flex-col gap-1">Create Auction</ModalHeader>
                <ModalBody>
                  <Form
                    className="w-full justify-center items-center space-y-4"
                    validationErrors={errors}
                    onReset={() => setSubmitted(null)}
                    onSubmit={(e) => handleSubmit(e)}
                  >
                    <div className="flex flex-col gap-4 w-full">
                      <Input
                        isRequired
                        label="Name"
                        labelPlacement="outside"
                        name="name"
                        placeholder="Enter auction name"
                        value={formData.name}
                        onChange={handleChange}
                      />

                      <Textarea
                        isRequired
                        label="Description"
                        labelPlacement="outside"
                        name="description"
                        placeholder="Enter auction description"
                        value={formData.description}
                        onChange={handleChange}
                      />

                      <Input
                        isRequired
                        type="number"
                        label="Duration (minutes)"
                        labelPlacement="outside"
                        name="duration"
                        placeholder="Enter duration"
                        value={formData.duration}
                        onChange={handleChange}
                      />

                      <Input
                        isRequired
                        type="number"
                        label="Starting Bid (ETH)"
                        labelPlacement="outside"
                        name="startingBid"
                        placeholder="Enter starting bid"
                        value={formData.startingBid}
                        onChange={handleChange}
                      />

                      <div className="flex gap-4 mt-2">
                        <Button
                          className="w-full"
                          color="primary"
                          type="submit"
                          isLoading={isSubmitting}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>

                    {submitted && (
                      <div className="text-small text-default-500 mt-4">
                        Submitted data: <pre>{JSON.stringify(submitted, null, 2)}</pre>
                      </div>
                    )}
                  </Form>
                </ModalBody>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </>
  )
}