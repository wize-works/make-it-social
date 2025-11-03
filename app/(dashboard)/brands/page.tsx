'use client';

import { useState, useMemo } from 'react';
import { useBrandProfile } from '@/hooks/use-brand-profile';
import { useOrganization } from '@/contexts/OrganizationContext';
import type { Company, Product } from '@/types';
import { CompanyCard } from './components/company-card';
import { ProductCard } from './components/product-card';
import { AddCompanyModal } from './components/add-company-modal';
import { AddProductModal } from './components/add-product-modal';
import { EditCompanyModal } from './components/edit-company-modal';
import { DeleteCompanyModal } from './components/delete-company-modal';

export default function BrandsPage() {
    const { organizationId } = useOrganization();
    const { companies, products: allProducts } = useBrandProfile(organizationId || undefined);

    // Use derived state for selected company - first company if none selected
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [isEditCompanyModalOpen, setIsEditCompanyModalOpen] = useState(false);
    const [isDeleteCompanyModalOpen, setIsDeleteCompanyModalOpen] = useState(false);
    const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);
    const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

    // Derive effective selected company
    const effectiveSelectedCompany = selectedCompany || (companies.length > 0 ? companies[0] : null);

    // Filter products for selected company
    const products = useMemo(() => {
        if (!effectiveSelectedCompany) return [];
        return allProducts.filter((p: Product) => p.companyId === effectiveSelectedCompany.id);
    }, [effectiveSelectedCompany, allProducts]);

    const handleCompanySelect = (company: Company) => {
        setSelectedCompany(company);
    };

    const handleEditCompany = (company: Company) => {
        setCompanyToEdit(company);
        setIsEditCompanyModalOpen(true);
    };

    const handleDeleteCompany = (company: Company) => {
        setCompanyToDelete(company);
        setIsDeleteCompanyModalOpen(true);
    };

    const handleSaveCompany = (updatedCompany: Company) => {
        // TODO: Update company in state/backend
        console.log('Saving company:', updatedCompany);

        // If the edited company is selected, update selected company
        if (effectiveSelectedCompany?.id === updatedCompany.id) {
            setSelectedCompany(updatedCompany);
        }
    };

    const handleConfirmDelete = (company: Company) => {
        // TODO: Delete company from state/backend
        console.log('Deleting company:', company);

        // If deleted company was selected, clear selection
        if (effectiveSelectedCompany?.id === company.id) {
            setSelectedCompany(null);
        }
    };

    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Brand Management</h1>
                    <p className="text-base-content/70">
                        Manage your companies and product brands for targeted content creation
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Companies Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Companies</h2>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => setIsAddCompanyModalOpen(true)}
                            >
                                <i className="fa-solid fa-duotone fa-plus mr-2"></i>
                                Add Company
                            </button>
                        </div>

                        <div className="space-y-3">
                            {companies.map(company => (
                                <CompanyCard
                                    key={company.id}
                                    company={company}
                                    isSelected={effectiveSelectedCompany?.id === company.id}
                                    onClick={() => handleCompanySelect(company)}
                                    onEdit={handleEditCompany}
                                    onDelete={handleDeleteCompany}
                                />
                            ))}
                        </div>

                        {companies.length === 0 && (
                            <div className="card bg-base-200">
                                <div className="card-body text-center">
                                    <i className="fa-solid fa-duotone fa-building text-4xl text-base-content/30 mb-2"></i>
                                    <p className="text-base-content/70">No companies yet</p>
                                    <button
                                        className="btn btn-primary btn-sm mt-2"
                                        onClick={() => setIsAddCompanyModalOpen(true)}
                                    >
                                        Add Your First Company
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Products Section */}
                    <div className="lg:col-span-2">
                        {effectiveSelectedCompany ? (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            Products for {effectiveSelectedCompany.name}
                                        </h2>
                                        <p className="text-sm text-base-content/70">
                                            {effectiveSelectedCompany.isPersonal && (
                                                <span className="badge badge-sm badge-primary mr-2">Personal</span>
                                            )}
                                            {products.length} {products.length === 1 ? 'product' : 'products'}
                                        </p>
                                    </div>
                                    <button
                                        className="btn btn-accent btn-sm"
                                        onClick={() => setIsAddProductModalOpen(true)}
                                    >
                                        <i className="fa-solid fa-duotone fa-plus mr-2"></i>
                                        Add Product
                                    </button>
                                </div>

                                {products.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {products.map(product => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="card bg-base-200">
                                        <div className="card-body text-center">
                                            <i className="fa-solid fa-duotone fa-box text-4xl text-base-content/30 mb-2"></i>
                                            <p className="text-base-content/70">
                                                No products for {effectiveSelectedCompany.name} yet
                                            </p>
                                            <p className="text-sm text-base-content/60 mb-2">
                                                Products help you create targeted content with specific brand voices
                                            </p>
                                            <button
                                                className="btn btn-accent btn-sm mt-2"
                                                onClick={() => setIsAddProductModalOpen(true)}
                                            >
                                                Add Your First Product
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="card bg-base-200 h-full">
                                <div className="card-body flex items-center justify-center">
                                    <i className="fa-solid fa-duotone fa-arrow-left text-4xl text-base-content/30 mb-2"></i>
                                    <p className="text-base-content/70">Select a company to view products</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modals */}
                <AddCompanyModal
                    isOpen={isAddCompanyModalOpen}
                    onClose={() => setIsAddCompanyModalOpen(false)}
                />
                <AddProductModal
                    isOpen={isAddProductModalOpen}
                    onClose={() => setIsAddProductModalOpen(false)}
                    companyId={effectiveSelectedCompany?.id || ''}
                    companyName={effectiveSelectedCompany?.name || ''}
                    onAdd={(product) => {
                        console.log('Adding product:', product);
                        setIsAddProductModalOpen(false);
                    }}
                />
                <EditCompanyModal
                    isOpen={isEditCompanyModalOpen}
                    onClose={() => setIsEditCompanyModalOpen(false)}
                    company={companyToEdit}
                    onSave={handleSaveCompany}
                />
                <DeleteCompanyModal
                    isOpen={isDeleteCompanyModalOpen}
                    onClose={() => setIsDeleteCompanyModalOpen(false)}
                    company={companyToDelete}
                    onConfirm={handleConfirmDelete}
                />
            </main>
        </div>
    );
}
